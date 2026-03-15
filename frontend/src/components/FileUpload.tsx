import React, { useState, useCallback } from 'react';
import { Upload, FileJson, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import api, { type Transcript } from '../lib/api';

interface FileUploadProps {
    onAnalysisComplete: (result: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
    const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
    const [promptFile, setPromptFile] = useState<File | null>(null);
    const [transcriptId, setTranscriptId] = useState<string | null>(null);
    const [promptId, setPromptId] = useState<string | null>(null);
    const isUploading = false;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');

    const handleTranscriptDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.json')) {
            setTranscriptFile(file);
            setTranscriptId(null);
        }
    }, []);

    const handlePromptDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
            setPromptFile(file);
            setPromptId(null);
        }
    }, []);

    const handleDirectAnalysis = async () => {
        if (!transcriptFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            setStatus('Reading files...');

            // Read files
            const transcriptText = await transcriptFile.text();
            const transcripts: Transcript[] = JSON.parse(transcriptText);
            const promptText = promptFile ? await promptFile.text() : undefined;

            setStatus('Running analysis (this may take a moment)...');

            // Run direct analysis
            const result = await api.runAnalysisDirect(transcripts, promptText);
            onAnalysisComplete(result);
            setStatus('Analysis complete!');
        } catch (err: any) {
            // Extract error message from various error formats
            let errorMessage = 'Analysis failed';
            if (err?.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold gradient-text">Upload Your Data</h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Upload your call transcripts and reference prompt to begin the ML-powered analysis.
                    No data leaves your machine - all processing is 100% local.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Transcript Upload */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleTranscriptDrop}
                    className={cn(
                        'glass-card p-8 flex flex-col items-center justify-center gap-4 cursor-pointer',
                        'border-2 border-dashed transition-all duration-300 hover-lift',
                        transcriptFile
                            ? 'border-primary-500/50'
                            : 'border-white/10 hover:border-primary-500/30'
                    )}
                    onClick={() => document.getElementById('transcript-input')?.click()}
                >
                    <input
                        id="transcript-input"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setTranscriptFile(file);
                                setTranscriptId(null);
                            }
                        }}
                    />

                    <div
                        className={cn(
                            'p-4 rounded-full',
                            transcriptFile ? 'bg-primary-500/20' : 'bg-white/5'
                        )}
                    >
                        <FileJson
                            size={32}
                            className={transcriptFile ? 'text-primary-400' : 'text-gray-400'}
                        />
                    </div>

                    <div className="text-center">
                        <h3 className="font-semibold text-lg">Transcripts (JSON)</h3>
                        {transcriptFile ? (
                            <p className="text-primary-400 text-sm mt-1">{transcriptFile.name}</p>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">
                                Drop file or click to browse
                            </p>
                        )}
                    </div>

                    {transcriptId && (
                        <div className="flex items-center gap-2 text-success-500 text-sm">
                            <CheckCircle2 size={16} />
                            <span>Uploaded</span>
                        </div>
                    )}
                </div>

                {/* Prompt Upload */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handlePromptDrop}
                    className={cn(
                        'glass-card p-8 flex flex-col items-center justify-center gap-4 cursor-pointer',
                        'border-2 border-dashed transition-all duration-300 hover-lift',
                        promptFile
                            ? 'border-primary-500/50'
                            : 'border-white/10 hover:border-primary-500/30'
                    )}
                    onClick={() => document.getElementById('prompt-input')?.click()}
                >
                    <input
                        id="prompt-input"
                        type="file"
                        accept=".md,.txt"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setPromptFile(file);
                                setPromptId(null);
                            }
                        }}
                    />

                    <div
                        className={cn(
                            'p-4 rounded-full',
                            promptFile ? 'bg-primary-500/20' : 'bg-white/5'
                        )}
                    >
                        <FileText
                            size={32}
                            className={promptFile ? 'text-primary-400' : 'text-gray-400'}
                        />
                    </div>

                    <div className="text-center">
                        <h3 className="font-semibold text-lg">Reference Prompt <span className="text-gray-500 text-sm font-normal">(Optional)</span></h3>
                        {promptFile ? (
                            <p className="text-primary-400 text-sm mt-1">{promptFile.name}</p>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">
                                Uses built-in ABHI prompt if not provided
                            </p>
                        )}
                    </div>

                    {promptId && (
                        <div className="flex items-center gap-2 text-success-500 text-sm">
                            <CheckCircle2 size={16} />
                            <span>Uploaded</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status & Error */}
            {status && (
                <div className="text-center text-gray-400">
                    {isUploading || isAnalyzing ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span>{status}</span>
                        </div>
                    ) : (
                        <span>{status}</span>
                    )}
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center gap-2 text-danger-500 bg-danger-500/10 py-3 px-4 rounded-lg">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleDirectAnalysis}
                    disabled={!transcriptFile || isAnalyzing}
                    className={cn(
                        'flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg',
                        'transition-all duration-300',
                        transcriptFile && !isAnalyzing
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white glow-primary'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    )}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            <span>Start Analysis</span>
                        </>
                    )}
                </button>

                <p className="text-gray-500 text-sm">
                    Processing uses local ML models only • No data sent externally
                </p>
            </div>
        </div>
    );
};
