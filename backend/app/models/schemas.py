"""
Pydantic schemas for API requests and responses
ConversaIQ Intent Analytics Platform
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class CallCategory(str, Enum):
    SUCCESS = "success"  # template_id ends in '4a'
    FAILURE = "failure"  # template_id ends in 'fa'


class TranscriptTurn(BaseModel):
    """Single turn in a conversation"""
    role: str  # 'bot' or 'customer'
    text: str


class CallTranscript(BaseModel):
    """Single call transcript"""
    call_id: str
    template_id: str
    transcript: List[TranscriptTurn]

    @property
    def category(self) -> CallCategory:
        """Determine call category based on template_id suffix"""
        if self.template_id.endswith('4a'):
            return CallCategory.SUCCESS
        elif self.template_id.endswith('fa'):
            return CallCategory.FAILURE
        return CallCategory.FAILURE


class BatchTranscripts(BaseModel):
    """Batch of transcripts for analysis"""
    transcripts: List[CallTranscript]


# ── Intent Analytics Schemas (New Pipeline) ──────────────────────────────────

class TurnIntent(str, Enum):
    """Turn-level intent categories - 10 bot + 27 human"""
    # Bot intents (10)
    GREETING = "GREETING"
    OFFER_PRESENTATION = "OFFER_PRESENTATION"
    CONSENT_REQUEST = "CONSENT_REQUEST"
    DISCOVERY_QUESTION = "DISCOVERY_QUESTION"
    PROFILING_QUESTION = "PROFILING_QUESTION"
    PED_CHECK = "PED_CHECK"
    RECOMMENDATION = "RECOMMENDATION"
    CALLBACK_SCHEDULING = "CALLBACK_SCHEDULING"
    OBJECTION_HANDLING = "OBJECTION_HANDLING"
    CLOSING = "CLOSING"
    
    # Human intents - Core Response (3)
    AGREEMENT = "AGREEMENT"
    REJECTION = "REJECTION"
    OBJECTION = "OBJECTION"
    
    # Human intents - Information Sharing (4)
    INFORMATION_SHARING = "INFORMATION_SHARING"
    FAMILY_INFO_SHARING = "FAMILY_INFO_SHARING"
    HEALTH_INFO_SHARING = "HEALTH_INFO_SHARING"
    POLICY_INFO_SHARING = "POLICY_INFO_SHARING"
    
    # Human intents - Engagement (4)
    INQUIRY = "INQUIRY"
    INTEREST_EXPRESSED = "INTEREST_EXPRESSED"
    COMPARISON_REQUEST = "COMPARISON_REQUEST"
    CLARIFICATION_REQUEST = "CLARIFICATION_REQUEST"
    
    # Human intents - Specific Objections (4)
    PRICE_CONCERN = "PRICE_CONCERN"
    TIME_CONSTRAINT = "TIME_CONSTRAINT"
    ALREADY_HAS_INSURANCE = "ALREADY_HAS_INSURANCE"
    TRUST_CONCERN = "TRUST_CONCERN"
    
    # Human intents - Callback Related (3)
    CALLBACK_ACCEPTANCE = "CALLBACK_ACCEPTANCE"
    CALLBACK_REJECTION = "CALLBACK_REJECTION"
    CALLBACK_RESCHEDULE = "CALLBACK_RESCHEDULE"
    
    # Human intents - Conversation Flow (4)
    CONFIRMATION = "CONFIRMATION"
    CONFUSION = "CONFUSION"
    STALLING = "STALLING"
    HESITATION = "HESITATION"
    
    # Human intents - Special Cases (4)
    REQUEST_HUMAN_AGENT = "REQUEST_HUMAN_AGENT"
    WRONG_NUMBER = "WRONG_NUMBER"
    GRATITUDE = "GRATITUDE"
    GREETING_RESPONSE = "GREETING_RESPONSE"


class CallOutcome(str, Enum):
    """7 call-level outcome categories"""
    QUALIFIED_LEAD = "QUALIFIED_LEAD"
    NOT_INTERESTED_PRICE = "NOT_INTERESTED_PRICE"
    NOT_INTERESTED_TIME = "NOT_INTERESTED_TIME"
    NOT_INTERESTED_TRUST = "NOT_INTERESTED_TRUST"
    NOT_INTERESTED_ALREADY_HAS = "NOT_INTERESTED_ALREADY_HAS"
    CALL_LATER_SOFT = "CALL_LATER_SOFT"
    CALL_LATER_HARD = "CALL_LATER_HARD"


class LabeledTurn(BaseModel):
    """Turn with intent label from LLM or classifier"""
    role: str
    text: str
    intent: str
    confidence: float = 0.0
    probabilities: Optional[Dict[str, float]] = None


class ClassifiedCall(BaseModel):
    """Fully classified call with turn intents and overall outcome"""
    call_id: str
    template_id: str
    turns: List[LabeledTurn]
    overall_outcome: str
    outcome_confidence: float = 0.0
    outcome_probabilities: Optional[Dict[str, float]] = None


class ClusterSummary(BaseModel):
    """Summary of a call cluster from Phase 5"""
    cluster_id: int
    label: str
    size: int
    percentage: float
    dominant_outcome: str
    avg_turns: float
    avg_engagement: float
    avg_objection_rate: float
    avg_agreement_rate: float
    qualified_rate: float


class CallAnalyticsRow(BaseModel):
    """Single row from the analytics table (50+ features)"""
    call_id: str
    template_id: str
    outcome: str
    outcome_confidence: float
    call_qualified: int
    total_turns: int
    human_turns: int
    objection_rate: float
    agreement_rate: float
    customer_engagement_score: float
    flow_depth_score: float
    cluster: Optional[int] = None
    pca_x: Optional[float] = None
    pca_y: Optional[float] = None


# ── Legacy Schemas (kept for backward compatibility) ─────────────────────────

class ObjectionMatch(BaseModel):
    """Matched objection from anchor dictionary"""
    turn_text: str
    anchor_category: str
    similarity_score: float
    rebuttal_followed: bool
    bot_response: Optional[str] = None


class ClusterPoint(BaseModel):
    """Single point in UMAP cluster visualization"""
    x: float
    y: float
    text: str
    cluster_id: int
    cluster_label: str
    call_id: str


class DiscoveredCluster(BaseModel):
    """Discovered objection cluster"""
    cluster_id: int
    label: str
    keywords: List[str]
    sample_texts: List[str]
    count: int
    avg_sentiment: float


class SentimentPoint(BaseModel):
    """Sentiment at a conversation point"""
    turn_index: int
    sentiment_score: float
    role: str
    text: str


class AnalysisResult(BaseModel):
    """Complete analysis result (legacy + intent analytics)"""
    analysis_id: str
    created_at: datetime
    total_calls: int
    success_calls: int
    failure_calls: int

    # Legacy Phase B: Objection Classification
    known_objections: List[ObjectionMatch] = []
    objection_summary: Dict[str, int] = {}

    # Legacy Phase C: Zero-Day Discovery
    cluster_points: List[ClusterPoint] = []
    discovered_clusters: List[DiscoveredCluster] = []

    # Legacy Phase D: Sentiment
    avg_sentiment_velocity_success: float = 0.0
    avg_sentiment_velocity_failure: float = 0.0

    # Call insights
    call_insights: Optional[List[Dict[str, Any]]] = None
    overall_summary: Optional[Dict[str, Any]] = None


class UploadResponse(BaseModel):
    """Response for file uploads"""
    success: bool
    message: str
    file_id: Optional[str] = None
    record_count: Optional[int] = None


class AnalysisRequest(BaseModel):
    """Request to trigger analysis"""
    transcript_file_id: str
    prompt_file_id: Optional[str] = None


class AnalysisStatusResponse(BaseModel):
    """Analysis status response"""
    analysis_id: str
    status: str  # 'pending', 'processing', 'completed', 'failed'
    progress: int  # 0-100
    message: Optional[str] = None


# ── Enhanced Ground Truth Schemas (Phase 1 Enhanced) ─────────────────────────

class EmotionCategory(str, Enum):
    """9 emotion categories from ABHI.xlsx"""
    # Positive emotions
    JOY_HAPPINESS = "Joy/Happiness"
    EXCITEMENT_ANTICIPATION = "Excitement/Anticipation"
    TRUST_CONFIDENCE = "Trust/Confidence"
    CONTENTMENT_RELIEF = "Contentment/Relief"
    # Negative emotions
    FEAR_ANXIETY = "Fear/Anxiety"
    ANGER_FRUSTRATION = "Anger/Frustration"
    GUILT_SHAME = "Guilt/Shame"
    SADNESS = "Sadness"
    # Neutral
    NEUTRAL = "Neutral"


class NERData(BaseModel):
    """Named Entity Recognition data for a turn"""
    PERSON: List[str] = Field(default_factory=list, description="Person names mentioned")
    ORG: List[str] = Field(default_factory=list, description="Organization names")
    PRODUCT: List[str] = Field(default_factory=list, description="Insurance products mentioned")
    DATE: List[str] = Field(default_factory=list, description="Dates/times mentioned")
    MONEY: List[str] = Field(default_factory=list, description="Premium amounts")
    PHONE: List[str] = Field(default_factory=list, description="Phone numbers")


class EnhancedTurn(BaseModel):
    """Enhanced turn with detailed contextual analysis"""
    turn_id: str = Field(..., description="Structured ID: CallID-B/H-SequenceNumber")
    turn_index: int = Field(..., description="0-based index in conversation")
    turn_owner: str = Field(..., description="'Bot' or 'Human'")
    text_stream: str = Field(..., description="The actual text of the turn")
    timestamp: Optional[str] = Field(None, description="ISO timestamp if available")
    turn_length_words: int = Field(..., description="Word count of the turn")
    metadata: str = Field("", description="Context-preserving summary of the turn")
    ner_data: NERData = Field(default_factory=NERData, description="Named entities")
    turn_duration_s: Optional[float] = Field(None, description="Duration in seconds if available")
    intent: str = Field(..., description="Intent category")
    intent_confidence: float = Field(0.0, description="Confidence score 0-1")
    sentiment: str = Field("neutral", description="positive/neutral/negative")
    sentiment_score: float = Field(0.0, description="Sentiment score -1.0 to 1.0")
    previous_turn_id: Optional[str] = Field(None, description="ID of the previous turn")
    intent_sequence: List[str] = Field(default_factory=list, description="Cumulative intent list")
    emotion: str = Field("Neutral", description="Emotion category from the 9 options")
    reasoning: str = Field("", description="Why this intent/emotion was chosen")


class EnhancedCall(BaseModel):
    """Enhanced call with detailed turn-level and call-level analysis"""
    call_id: str = Field(..., description="Unique call identifier")
    disposition: str = Field(..., description="Raw disposition from source")
    duration_s: Optional[float] = Field(None, description="Call duration if available")
    total_turns: int = Field(..., description="Total number of turns")
    bot_turns: int = Field(..., description="Number of bot turns")
    human_turns: int = Field(..., description="Number of human turns")
    sub_disposition: Optional[str] = Field(None, description="Sub-disposition if provided")
    summary: str = Field("", description="2-3 sentence call summary")
    overall_emotion: str = Field("Neutral", description="Dominant emotion of the call")
    call_score: float = Field(0.5, description="Conversion probability 0-1")
    customer_name: str = Field("Unknown", description="Customer name")
    outcome: str = Field(..., description="Call outcome category")
    outcome_confidence: float = Field(0.5, description="Outcome confidence 0-1")
    call_reached_stage: str = Field("GREETING", description="Funnel stage reached")
    primary_objections: List[str] = Field(default_factory=list, description="List of objections")
    notable_customer_phrases: List[str] = Field(default_factory=list, description="Key customer quotes")
    turns: List[EnhancedTurn] = Field(default_factory=list, description="Enhanced turn data")
