'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Send, RefreshCw, Copy, Check, Volume2 } from 'lucide-react'

interface VoiceToEmailModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile?: {
    name: string
    email?: string
    phone: string
  }
}

export default function VoiceToEmailModal({ isOpen, onClose, userProfile }: VoiceToEmailModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US' // Can be changed to support multiple languages

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart + ' '
            } else {
              interimTranscript += transcriptPart
            }
          }

          setTranscript(prev => prev + finalTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setError('Could not recognize speech. Please try again.')
          setIsListening(false)
        }
      } else {
        setError('Speech recognition is not supported in your browser.')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setError('')
      setTranscript('')
      setGeneratedEmail('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const generateEmail = async () => {
    if (!transcript.trim()) {
      setError('Please speak something first.')
      return
    }

    setIsGenerating(true)
    setError('')

    // Simulate AI generation (in production, call your AI API)
    setTimeout(() => {
      const email = formatTranscriptToEmail(transcript)
      setGeneratedEmail(email)
      setIsGenerating(false)
    }, 1500)
  }

  const formatTranscriptToEmail = (text: string): string => {
    // Simple email formatting logic
    // In production, this would call an AI API (OpenAI, Claude, etc.)
    
    const lines = text.trim().split(/[.!?]+/).filter(line => line.trim())
    
    let emailBody = `Dear Support Team,\n\n`
    
    // Try to detect issue type
    const lowerText = text.toLowerCase()
    let subject = 'Request for Assistance'
    
    if (lowerText.includes('pay') || lowerText.includes('payment') || lowerText.includes('money')) {
      subject = 'Payment Issue - Requires Attention'
      emailBody += `I am writing to report an issue regarding my payment.\n\n`
    } else if (lowerText.includes('hour') || lowerText.includes('time') || lowerText.includes('overtime')) {
      subject = 'Working Hours Concern'
      emailBody += `I would like to raise a concern about my working hours.\n\n`
    } else if (lowerText.includes('super') || lowerText.includes('superannuation')) {
      subject = 'Superannuation Query'
      emailBody += `I have a question regarding my superannuation.\n\n`
    } else if (lowerText.includes('contract') || lowerText.includes('agreement')) {
      subject = 'Contract Related Issue'
      emailBody += `I need assistance with a contract-related matter.\n\n`
    } else {
      emailBody += `I would like to bring the following matter to your attention:\n\n`
    }
    
    // Add the main content
    lines.forEach(line => {
      if (line.trim()) {
        emailBody += `${line.trim()}.\n\n`
      }
    })
    
    emailBody += `I would appreciate your prompt attention to this matter.\n\n`
    emailBody += `Thank you for your assistance.\n\n`
    emailBody += `Best regards,\n`
    emailBody += `${userProfile?.name || 'PALM Worker'}\n`
    if (userProfile?.phone) {
      emailBody += `Contact: ${userProfile.phone}\n`
    }
    
    return `Subject: ${subject}\n\n${emailBody}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const sendEmail = async () => {
    setIsSending(true)
    
    // Simulate sending email (in production, call your email API)
    setTimeout(() => {
      setIsSending(false)
      setEmailSent(true)
      
      setTimeout(() => {
        onClose()
        setTranscript('')
        setGeneratedEmail('')
        setEmailSent(false)
      }, 2000)
    }, 1500)
  }

  const handleClose = () => {
    if (isListening) {
      stopListening()
    }
    setTranscript('')
    setGeneratedEmail('')
    setError('')
    setEmailSent(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d1f2d] border border-cyan-800/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Speak Your Problem</h2>
              <p className="text-sm text-gray-400">We'll generate a professional email for you</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Voice Recording */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Step 1: Speak Your Issue</h3>
            </div>
            
            <div className="bg-[#0a1929]/50 border border-cyan-800/20 rounded-xl p-6 mb-4">
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isGenerating || isSending}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  } ${isGenerating || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                  {isListening && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse"></span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-center text-sm text-gray-400 mb-4">
                {isListening ? '🎤 Listening... Click to stop' : 'Click the microphone to start speaking'}
              </p>

              {transcript && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 min-h-[100px]">
                  <p className="text-sm text-white whitespace-pre-wrap">{transcript}</p>
                </div>
              )}
            </div>

            {!isListening && transcript && !generatedEmail && (
              <button
                onClick={generateEmail}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Email
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step 2: Generated Email */}
          {generatedEmail && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Step 2: Review & Send</h3>
              </div>
              
              <div className="bg-[#0a1929]/50 border border-cyan-800/20 rounded-xl p-6">
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                  <pre className="text-sm text-white whitespace-pre-wrap font-sans">{generatedEmail}</pre>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateEmail}
                    disabled={isGenerating}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>

                  <button
                    onClick={sendEmail}
                    disabled={isSending || emailSent}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : emailSent ? (
                      <>
                        <Check className="w-4 h-4" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Tips for best results:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>Speak clearly and at a normal pace</li>
              <li>Mention key details: dates, amounts, names</li>
              <li>Describe what happened and what you need</li>
              <li>You can review and edit the email before sending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

