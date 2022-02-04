<template>
    <div >
        <video id="myVideo" ref="fvdo" autoplay></video>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
export default {
    data: () => ({
        database: firebase.database().ref('rtc'),
        yourId: '1000',
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

<style scoped>
    #myVideo {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
    }
</style>