export function getSessionId(): string {
  let sessionId = localStorage.getItem('chelouve_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chelouve_session_id', sessionId);
  }

  return sessionId;
}
