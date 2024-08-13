import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import '../App.css';

const PhaserGame = ({ onSessionEnd, sessionData }) => {
    const gameRef = useRef(null);
    const ballRef = useRef(null);
    const countdownTextRef = useRef(null);
    let sessionActive = false;
    let countdownValue = 0;
    let countdownTimer;
    let startTime;

    const startSession = () => {
        sessionActive = true;
        countdownValue = Phaser.Math.Between(30, 120);
        startTime = new Date().toLocaleTimeString();

        countdownTimer = setInterval(() => {
            countdownValue--;
            if (countdownValue <= 0) {
                endSession();
            }
        }, 1000);
    };

    const endSession = () => {
        sessionActive = false;
        clearInterval(countdownTimer);

        const endTime = new Date().toLocaleTimeString();
        onSessionEnd({
            id: Math.random().toString(36).substr(2, 9),
            startTime,
            endTime
        });

        gameRef.current.sound.stopAll();
    };

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 400,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        gameRef.current = new Phaser.Game(config);

        function preload() {
            this.load.image('Ball', 'ball.png');
            this.load.audio('clockSound', 'Clock.mp3');
        }

        function create() {
            ballRef.current = this.physics.add.image(20, 10, 'Ball')
                .setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200))
                .setBounce(1)
                .setCollideWorldBounds(true);

            countdownTextRef.current = this.add.text(16, 16, 'Countdown: ', { fontSize: '32px', fill: '#000' });

            this.sound.add('clockSound');
        }

        function update() {
            if (sessionActive && countdownValue > 0) {
                countdownTextRef.current.setText('Countdown: ' + countdownValue);

                if (!this.sound.get('clockSound').isPlaying) {
                    this.sound.play('clockSound', { loop: true });
                }
            }
        }

        return () => {
            gameRef.current.destroy(true);
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
