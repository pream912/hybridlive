<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <video ref="mvdo" autoplay muted playsinline></video>
            </v-col>
            <v-col cols="6">
                <video ref="fvdo" autoplay playsinline></video>
            </v-col>
            <v-col>
                <v-btn @click="showFriendsFace"> Call</v-btn>
                <v-btn @click="shareScreen"> Screen</v-btn>
                <v-btn @click="showMyFace"> switch back</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
export default {
    data: () => ({
        database: firebase.database().ref(),
        yourId: '1001',
        pc: new RTCPeerConnection({'iceServers': [{'urls': 'turn:172.105.37.191:3478','credential': 'Kumar912','username': 'pream912'}]})
    }),

    methods: {
        sendMessage(senderId, data) {
            firebase.database().ref('rtc').push({ sender: senderId, message: data })
            .then((data) => {
              const key = data.key
              firebase.database().ref('rtc/'+key).remove()
            })
            .catch((err)=> console.log(err.message))
        },

        readMessage(data) {
            var msg = JSON.parse(data.val().message)
            var sender = data.val().sender
            if (sender != this.yourId) {
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

        showMyFace() {
            navigator.mediaDevices.getUserMedia({audio:true, video:true})
            .then(stream => this.$refs.mvdo.srcObject = stream)
            .then(stream => this.pc.addStream(stream))
        },

        shareScreen () {
            navigator.mediaDevices.getDisplayMedia()
            .then(stream => this.$refs.mvdo.srcObject = stream)
            .then(stream => this.pc.addStream(stream))
            .then(() => this.showFriendsFace())
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
        this.showMyFace()
    }
}
</script>