class PeetService {
  peer?: RTCPeerConnection;

  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ],
        iceTransportPolicy: 'all',
        bundlePolicy: 'balanced',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 0
      });
    }
  }

  async getAnswer(offer:any) {
    await this.peer?.setRemoteDescription(offer)
    const answer = await this.peer?.createAnswer();
    if(answer){
      await this.peer?.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async setLocalDescription(answer: RTCSessionDescription) {
    if(this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }

  async getOffer() {
    if (!this.peer) return;
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }
}

export default new PeetService();
