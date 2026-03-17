export function getSessionId(): string {
  let sessionId = localStorage.getItem('manzil_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('manzil_session_id', sessionId);
  }

  return sessionId;
}
