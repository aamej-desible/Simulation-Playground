"""
In-memory database for storing uploads and analysis results
"""
from typing import Dict, Optional, List, Any
from datetime import datetime
import uuid


class Database:
    """Simple in-memory storage for transcripts and analysis results"""
    
    def __init__(self):
        self._transcripts: Dict[str, Any] = {}
        self._prompts: Dict[str, str] = {}
        self._analyses: Dict[str, Any] = {}
    
    def save_transcripts(self, transcripts: List[dict]) -> str:
        """Save transcripts and return file ID"""
        file_id = str(uuid.uuid4())
        self._transcripts[file_id] = {
            "data": transcripts,
            "uploaded_at": datetime.utcnow(),
            "count": len(transcripts)
        }
        return file_id
    
    def get_transcripts(self, file_id: str) -> Optional[List[dict]]:
        """Retrieve transcripts by file ID"""
        if file_id in self._transcripts:
            return self._transcripts[file_id]["data"]
        return None
    
    def save_prompt(self, prompt_text: str) -> str:
        """Save reference prompt and return file ID"""
        file_id = str(uuid.uuid4())
        self._prompts[file_id] = prompt_text
        return file_id
    
    def get_prompt(self, file_id: str) -> Optional[str]:
        """Retrieve prompt by file ID"""
        return self._prompts.get(file_id)
    
    def save_analysis(self, analysis_id: str, result: dict) -> None:
        """Save analysis result"""
        self._analyses[analysis_id] = result
    
    def get_analysis(self, analysis_id: str) -> Optional[dict]:
        """Retrieve analysis by ID"""
        return self._analyses.get(analysis_id)
    
    def list_analyses(self) -> List[dict]:
        """List all analyses"""
        return [
            {"analysis_id": aid, "created_at": data.get("created_at")}
            for aid, data in self._analyses.items()
        ]


# Global database instance
db = Database()
