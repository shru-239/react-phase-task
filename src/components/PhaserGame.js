import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import clockSound from '../assets/Clock.mp3'
import '../App.css';

const PhaserGame = ({ onSessionEnd, sessionData }) => {
    const gameRef = useRef(null);
    const ballRef = useRef(null);
    const countdownTextRef = useRef(null);
    const sessionActiveRef = useRef(false);
    const countdownValueRef = useRef(0);
    const countdownTimerRef = useRef(null);
    const startTimeRef = useRef(null);
    const soundRef = useRef(null);

    const startSession = () => {
        sessionActiveRef.current = true;
        countdownValueRef.current = Phaser.Math.Between(30, 120);
        startTimeRef.current = new Date().toLocaleTimeString();

        // Start the ball movement
        if (ballRef.current) {
            // ballRef.current.setVelocity(0, -400);
            const randomVelocityX = Phaser.Math.Between(-400, 400);  // Increase speed on X-axis
            const randomVelocityY = Phaser.Math.Between(-400, 400);  // Increase speed on Y-axis
            ballRef.current.setVelocity(randomVelocityX, randomVelocityY);
        }

        // Play the sound
        if (soundRef.current && soundRef.current.isDecoded) { // Check if sound is decoded first
            soundRef.current.play();
            console.log('Attempting to play sound');
        } else {
            console.log('Sound reference not found');
        }

        countdownTimerRef.current = setInterval(() => {
            countdownValueRef.current--;
            if (countdownValueRef.current <= 0) {
                endSession();
            }
        }, 1000);
    };

    const endSession = () => {
        sessionActiveRef.current = false;
        clearInterval(countdownTimerRef.current);

        const endTime = new Date().toLocaleTimeString();
        onSessionEnd({
            id: Math.random().toString(36).substr(2, 9),
            startTime: startTimeRef.current,
            endTime
        });

        // Stop the ball and sound
        if (ballRef.current) {
            ballRef.current.setVelocity(0, 0);
        }
        if (soundRef.current && soundRef.current.isPlaying) {
            soundRef.current.stop();
        }
    };

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1000,
            height: 500,
            parent: 'phaser-game',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 600 },
                    debug: false,
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            audio: {
                disableWebAudio: false
            }
        };

        gameRef.current = new Phaser.Game(config);

        function preload() {
            this.load.on('filecomplete', (key, success, file) => {
                console.log('File complete:', key, success, file);
            });
            this.load.image('Ball', 'ball1.png');
            this.load.audio('clockSound', clockSound, onAudioLoadComplete);
        }

        function onAudioLoadComplete() {
            soundRef.current = this.sound.add('clockSound', { loop: true });
            console.log('Clock sound loaded and decoded');
        }

        function create() {
            ballRef.current = this.physics.add.image(500, 250, 'Ball')
                .setScale(0.15)
                .setBounce(1)
                .setCollideWorldBounds(true)
                .setVelocity(0, 0);  // Start with no velocity

            countdownTextRef.current = this.add.text(16, 16, 'Countdown: ', { fontSize: '32px', fill: 'white' });

            // soundRef.current = this.sound.add('clockSound', { loop: true });
            // const sound = this.sound.add('clockSound', { loop: true });
            soundRef.current = this.sound.add('clockSound', { loop: true });
            console.log('Sound reference:', soundRef.current);

            try {
                soundRef.current.play();
                console.log('Audio played');
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }

        function update() {
            if (sessionActiveRef.current && countdownValueRef.current > 0) {
                countdownTextRef.current.setText('Countdown: ' + countdownValueRef.current);
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, [onSessionEnd]);

    useEffect(() => {
        if (sessionData.active) {
            startSession();
        }
    }, [sessionData]);

    return (
        <div id="phaser-game" className="phaser-container"></div>
    );
};

export default PhaserGame;
