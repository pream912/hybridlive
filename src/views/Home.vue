<template>
    <div width="1920" height="1080">
        <v-row align="center" justify="center">
            <video height="720" ref="fvdo" autoplay muted playsinline></video>
        </v-row>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
export default {
    data: () => ({
        database: firebase.database().ref(),
        yourId: '1000',
        pc: new RTCPeerConnection({'iceServers': [{'urls': 'turn:172.105.37.191:3478','credential': 'Kumar912','username': 'pream912'}]})
    }),

    methods: {
        sendMessage(senderId, data) {
            var msg = this.database.push({ sender: senderId, message: data })
            console.log(msg);
            msg.remove()
        },

        readMessage(data) {
            var msg = JSON.parse(data.val().message)
            var sender = data.val().sender
            if (sender == '1001') {
                if (msg.ice != undefined)
                    this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
                else if (msg.sdp.type == "offer")
                    this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                    .then(() => this.pc.createAnswer())
                    .then(answer => this.pc.setLocalDescription(answer))
                    .then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})));
                else if (msg.sdp.type == "answer")
                    this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            }
        },


        showFriendsFace() {
            this.pc.createOffer()
            .then(offer => this.pc.setLocalDescription(offer) )
            .then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})) )
        }
    },

    mounted () {
        this.pc.onicecandidate = (event => event.candidate?this.sendMessage(this.yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") )
        this.pc.onaddstream = (event => this.$refs.fvdo.srcObject = event.stream)
        this.database.on('child_added', this.readMessage)
    }
}
</script>