import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LandingPage } from "@/components/LandingPage";
import { Questionnaire } from "@/components/Questionnaire";
import { PreviewPage } from "@/components/PreviewPage";
import { LeadCapture } from "@/components/LeadCapture";
import { ResultPage } from "@/components/ResultPage";
import { noWillQuestions, existingWillQuestions } from "@/lib/questions";
import {
  generateWillPreview,
  generateFullWillDraft,
  generateExistingWillReview,
} from "@/lib/willDraftEngine";
import { toast } from "sonner";

type AppStep = "landing" | "questionnaire" | "preview" | "lead" | "results";
type Track = "noWill" | "existingWill";
type Intent = "full" | "email" | "callback";
type LeadTemperature = "hot" | "warm" | "cold";

type LeadInfo = {
  name: string;
  phone: string;
  email: string;
};

type ReviewData = {
  willType: string;
  riskLevel: string;
  issues: string[];
  headline: string;
};

type DraftData = {
  willType: string;
  fullDraft: string;
};

function normalizeValue(value?: string) {
  return (value || "").trim().toLowerCase();
}

function includesAny(value: string, candidates: string[]) {
  return candidates.some((c) => value.includes(c));
}

function getAnswer(answers: Record<string, string>, possibleKeys: string[]) {
  for (const key of possibleKeys) {
    if (answers[key]) return answers[key];
  }
  return "";
}

function calculateLeadScore(
  track: Track,
  answers: Record<string, string>
): { score: number; temperature: LeadTemperature; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const maritalStatus = normalizeValue(
    getAnswer(answers, ["maritalStatus", "familyStatus", "status"])
  );
  const hasChildren = normalizeValue(
    getAnswer(answers, ["hasChildren", "children"])
  );
  const hasMoreThanOneChild = normalizeValue(
    getAnswer(answers, ["hasMoreThanOneChild", "moreThanOneChild"])
  );
  const hasMinorChildren = normalizeValue(
    getAnswer(answers, ["hasMinorChildren", "minorChildren"])
  );
  const hasRealEstate = normalizeValue(
    getAnswer(answers, ["hasRealEstate", "realEstate"])
  );
  const significantAssets = normalizeValue(
    getAnswer(answers, ["hasSignificantAssets", "significantAssets", "assets"])
  );
  const unequalDistribution = normalizeValue(
    getAnswer(answers, ["unequalDistribution", "equalDistribution"])
  );
  const familyConflict = normalizeValue(
    getAnswer(answers, ["familyConflict", "conflict"])
  );
  const digitalAssets = normalizeValue(
    getAnswer(answers, ["digitalAssets", "hasDigitalAssets"])
  );
  const wantsExecutor = normalizeValue(
    getAnswer(answers, ["wantExecutor", "executor", "estateManager"])
  );
  const spouseProtection = normalizeValue(
    getAnswer(answers, ["spouseProtection", "protectSpouse", "protectPartner"])
  );
  const specialCircumstances = normalizeValue(
    getAnswer(answers, ["specialCircumstances", "specialFamilyCircumstances"])
  );
  const existingWillType = normalizeValue(
    getAnswer(answers, ["existingWillType", "willType"])
  );
  const familyChanged = normalizeValue(
    getAnswer(answers, ["familyChanged", "familyStatusChanged"])
  );
  const newAssets = normalizeValue(
    getAnswer(answers, ["newAssets", "addedAssets"])
  );

  if (track === "noWill") {
    score += 30;
    reasons.push("אין כיום צוואה");

    if (includesAny(maritalStatus, ["נשוי", "ידוע"])) {
      score += 10;
      reasons.push("מצב משפחתי שמצריך התאמה מדויקת");
    }

    if (includesAny(hasChildren, ["כן"])) {
      score += 10;
      reasons.push("יש ילדים");
    }

    if (includesAny(hasMoreThanOneChild, ["כן"])) {
      score += 8;
      reasons.push("יש יותר מיורש אחד");
    }

    if (includesAny(hasMinorChildren, ["כן"])) {
      score += 15;
      reasons.push("יש ילדים קטינים");
    }

    if (includesAny(hasRealEstate, ["כן"])) {
      score += 15;
      reasons.push("יש נכסי מקרקעין");
    }

    if (
      significantAssets &&
      !includesAny(significantAssets, ["אין", "לא"])
    ) {
      score += 10;
      reasons.push("יש נכסים משמעותיים נוספים");
    }

    if (includesAny(unequalDistribution, ["לא"])) {
      score += 20;
      reasons.push("נדרשת חלוקה שאינה שוויונית");
    }

    if (includesAny(familyConflict, ["כן", "לא בטוח"])) {
      score += 20;
      reasons.push("קיים סיכון למחלוקת בין יורשים");
    }

    if (includesAny(digitalAssets, ["כן", "לא בטוח"])) {
      score += 10;
      reasons.push("יש צורך להסדיר נכסים דיגיטליים");
    }

    if (includesAny(wantsExecutor, ["כן", "לא בטוח"])) {
      score += 8;
      reasons.push("יש צורך לבחון מינוי מנהל עיזבון");
    }

    if (includesAny(spouseProtection, ["כן", "לא בטוח"])) {
      score += 8;
      reasons.push("נדרשת הגנה על בן/בת הזוג");
    }

    if (includesAny(specialCircumstances, ["כן"])) {
      score += 15;
      reasons.push("יש נסיבות משפחתיות מיוחדות");
    }
  } else {
    score += 10;

    if (includesAny(existingWillType, ["הדד"])) {
      score += 10;
      reasons.push("קיימת צוואה הדדית הדורשת בדיקה מדויקת");
    }

    if (includesAny(familyChanged, ["כן"])) {
      score += 20;
      reasons.push("המצב המשפחתי השתנה מאז עריכת הצוואה");
    }

    if (includesAny(newAssets, ["כן"])) {
      score += 15;
      reasons.push("נוספו נכסים מאז עריכת הצוואה");
    }

    if (includesAny(digitalAssets, ["כן", "לא בטוח"])) {
      score += 10;
      reasons.push("ייתכן שאין הסדרה לנכסים דיגיטליים");
    }

    if (includesAny(familyConflict, ["כן", "לא בטוח"])) {
      score += 20;
      reasons.push("יש חשש למחלוקת בין יורשים");
    }

    if (includesAny(hasChildren, ["כן"])) {
      score += 8;
      reasons.push("יש ילדים");
    }

    if (includesAny(hasRealEstate, ["כן"])) {
      score += 10;
      reasons.push("יש נכסי מקרקעין");
    }
  }

  let temperature: LeadTemperature = "cold";
  if (score >= 70) temperature = "hot";
  else if (score >= 40) temperature = "warm";

  return { score, temperature, reasons };
}

function buildCommercialPreview(
  track: Track,
  answers: Record<string, string>
): { willType: string; keyPoints: string[] } {
  const lead = calculateLeadScore(track, answers);

  if (track === "noWill") {
    const preview = generateWillPreview(answers);
    const points = [...(preview?.keyPoints || [])]
      .filter(Boolean)
      .slice(0, 2);

    if (lead.reasons.length > 0) {
      points.push(`זוהו נקודות שמומלץ להסדיר: ${lead.reasons[0]}`);
    }

    if (lead.temperature === "hot") {
      points.push("לפי התשובות, מומלץ לבקש חזרה אישית ולא להסתפק בנוסח כללי.");
    } else if (lead.temperature === "warm") {
      points.push("נמצאו נושאים שמצריכים ניסוח מדויק לפני חתימה.");
    } else {
      points.push("ניתן להפיק נוסח ראשוני, אך מומלץ לבדוק התאמה משפטית.");
    }

    return {
      willType: preview?.willType || "נדרש בירור",
      keyPoints: points.slice(0, 3),
    };
  }

  const review = generateExistingWillReview(answers);
  const points = [...(review?.issues || [])].filter(Boolean).slice(0, 2);

  if (lead.reasons.length > 0) {
    points.push(`המערכת זיהתה צורך בבדיקה: ${lead.reasons[0]}`);
  }

  if (lead.temperature === "hot") {
    points.push("הבדיקה מצביעה על פערים מהותיים ומומלץ להשאיר בקשה לחזרה.");
  } else if (lead.temperature === "warm") {
    points.push("נמצאו נקודות שמומלץ לעדכן בצוואה הקיימת.");
  } else {
    points.push("מומלץ לבצע בדיקה קצרה לפני הסתמכות על הצוואה הקיימת.");
  }

  return {
    willType: review?.willType || "נדרש בירור",
    keyPoints: points.slice(0, 3),
  };
}

function buildCommercialReview(
  base: ReviewData,
  lead: { score: number; temperature: LeadTemperature; reasons: string[] }
): ReviewData {
  const issues = [...base.issues];

  if (lead.temperature === "hot") {
    issues.unshift("רמת הדחיפות גבוהה יחסית לפי הנתונים שמולאו במערכת.");
  } else if (lead.temperature === "warm") {
    issues.unshift("נמצאו פערים שמצדיקים בדיקה משפטית מסודרת.");
  }

  return {
    ...base,
    issues: issues.slice(0, 6),
    headline:
      lead.temperature === "hot"
        ? "זוהו פערים מהותיים בצוואה ומומלץ לעדכן אותה בהקדם"
        : base.headline,
  };
}

function buildCommercialDraft(
  base: DraftData,
  lead: { score: number; temperature: LeadTemperature; reasons: string[] }
): DraftData {
  let intro = "";

  if (lead.temperature === "hot") {
    intro =
      "הערה מקדימה: לפי הנתונים שנמסרו, קיימים מאפיינים שמצריכים התאמה משפטית פרטנית לפני חתימה, ובפרט בשל מורכבות משפחתית/נכסית.\n\n";
  } else if (lead.temperature === "warm") {
    intro =
      "הערה מקדימה: מדובר בנוסח ראשוני בלבד, ומומלץ לבצע בדיקה לפני חתימה כדי לוודא התאמה מלאה למצב המשפחתי והנכסי.\n\n";
  } else {
    intro =
      "הערה מקדימה: מדובר בנוסח ראשוני בלבד, שאינו מחליף בדיקה משפטית פרטנית.\n\n";
  }

  return {
    ...base,
    fullDraft: intro + base.fullDraft,
  };
}

export default function Index() {
  const [step, setStep] = useState<AppStep>("landing");
  const [track, setTrack] = useState<Track>("noWill");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [intent, setIntent] = useState<Intent>("callback");
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    phone: "",
    email: "",
  });

  const [previewType, setPreviewType] = useState("");
  const [previewPoints, setPreviewPoints] = useState<string[]>([]);

  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const leadAnalysis = useMemo(() => {
    return calculateLeadScore(track, answers);
  }, [track, answers]);

  function resetFlowForTrack(nextTrack: Track) {
    setTrack(nextTrack);
    setAnswers({});
    setIntent("callback");
    setLeadInfo({ name: "", phone: "", email: "" });
    setPreviewType("");
    setPreviewPoints([]);
    setDraftData(null);
    setReviewData(null);
  }

  function startTrack(nextTrack: Track) {
    resetFlowForTrack(nextTrack);
    setStep("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleQuestionnaireComplete(ans: Record<string, string>) {
    setAnswers(ans);

    const commercialPreview = buildCommercialPreview(track, ans);
    setPreviewType(commercialPreview.willType);
    setPreviewPoints(commercialPreview.keyPoints);

    setStep("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePreviewAction(action: Intent) {
    setIntent(action);
    setStep("lead");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLeadSubmit(info: { name: string; phone: string; email?: string }) {
    const cleanLead: LeadInfo = {
      name: info.name,
      phone: info.phone,
      email: info.email || "",
    };

    setLeadInfo(cleanLead);

    const analysis = calculateLeadScore(track, answers);

    if (track === "noWill") {
      const draft = generateFullWillDraft(answers);
      const commercialDraft = buildCommercialDraft(
        { willType: draft.willType, fullDraft: draft.fullDraft },
        analysis
      );
      setDraftData(commercialDraft);
    } else {
      const review = generateExistingWillReview(answers);
      const commercialReview = buildCommercialReview(review, analysis);
      setReviewData(commercialReview);
    }

    setStep("results");

    if (intent === "callback") {
      toast.success("הפרטים נקלטו בהצלחה.");
    } else if (analysis.temperature === "hot") {
      toast.success("הפרטים נקלטו בהצלחה. נוסח הצוואה מוכן לצפייה.");
    } else {
      toast.success("הפרטים נקלטו בהצלחה.");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showHeaderFooter = step === "landing" || step === "results";

  const noWillDraftPreviewData = useMemo(() => {
    if (track !== "noWill" || Object.keys(answers).length === 0) return undefined;
    return buildCommercialDraft(
      {
        willType: previewType || "נדרש בירור",
        fullDraft: generateFullWillDraft(answers).fullDraft,
      },
      leadAnalysis
    );
  }, [track, answers, previewType, leadAnalysis]);

  return (
    <>
      {showHeaderFooter && <Header />}

      {step === "landing" && (
        <LandingPage
          onNoWill={() => startTrack("noWill")}
          onExistingWill={() => startTrack("existingWill")}
        />
      )}

      {step === "questionnaire" && (
        <Questionnaire
          questions={track === "noWill" ? noWillQuestions : existingWillQuestions}
          onComplete={handleQuestionnaireComplete}
        />
      )}

      {step === "preview" && (
        <PreviewPage
          willType={previewType}
          keyPoints={previewPoints}
          onShowFull={() => handlePreviewAction("full")}
          onSendEmail={() => handlePreviewAction("email")}
          onCallback={() => handlePreviewAction("callback")}
        />
      )}

      {step === "lead" && (
        <LeadCapture
          answers={answers}
          intent={intent}
          willDraftData={noWillDraftPreviewData}
          onSubmit={handleLeadSubmit}
        />
      )}

      {step === "results" && track === "noWill" && draftData && (
        <ResultPage
          mode="draft"
          willType={draftData.willType}
          fullDraft={draftData.fullDraft}
          leadName={leadInfo.name}
          leadPhone={leadInfo.phone}
          leadEmail={leadInfo.email}
        />
      )}

      {step === "results" && track === "existingWill" && reviewData && (
        <ResultPage
          mode="review"
          willType={reviewData.willType}
          reviewHeadline={reviewData.headline}
          reviewIssues={reviewData.issues}
          reviewRiskLevel={reviewData.riskLevel}
          leadName={leadInfo.name}
          leadPhone={leadInfo.phone}
          leadEmail={leadInfo.email}
        />
      )}

      {showHeaderFooter && <Footer />}
    </>
  );
}
