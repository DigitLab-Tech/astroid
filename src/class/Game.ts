import Drawable from "../interface/Drawable";
import ColisionDispatcher from "./ColisionDispatcher";
import Goal from "./entity/Goal";
import Meteorite from "./entity/Meteorite";
import Player from "./entity/Player";
import LimitedNumber from "./LimitedNumber";
import Scene from "./Scene";


export default class Game {
    private scene: Scene;
    private player: Player;
    private player2: Player;
    private goal: Goal;
    private goal2: Goal;
    private meteorite: Meteorite;
    private entities: Drawable[];
    private keysPressed: Record<string, boolean>;
    private isStarted: boolean;
    private scoreElement = document.createElement("span");
    private playersScore = [0, 0];

    constructor() {
        this.initScoreElement();

        this.scene = new Scene();
        this.player = new Player(this.scene, {
            width: 26,
            height: 36,
            x: this.scene.width / 4,
            y: this.scene.height / 2,
            color: "#5eff00"
        }).initPath();

        this.player2 = new Player(this.scene, {
            width: 26,
            height: 36,
            x: (this.scene.width / 4) * 3,
            y: this.scene.height / 2,
            color: "#a903fc"
        }).initPath();

        this.meteorite = new Meteorite(this.scene, {
            x: this.scene.width / 2,
            y: this.scene.height / 2,
            speedX: new LimitedNumber({ min: -25, max: 25 }),
            speedY: new LimitedNumber({ min: -25, max: 25 }),
            size: 35,
            color: "#03fca9"
        }).initPath();

        this.goal = new Goal(this.scene, {
            x: 0,
            y: this.scene.height / 2,
            width: 3,
            height: this.scene.height
        }).initPath();

        this.goal2 = new Goal(this.scene, {
            x: this.scene.width - 3,
            y: this.scene.height / 2,
            width: 3,
            height: this.scene.height,
            color: "#a903fc"
        }).initPath();

        ColisionDispatcher.subscribe([this.player, this.player2], () => {
            ColisionDispatcher.elasticRebound(this.player, this.player2);
        });

        ColisionDispatcher.subscribe([this.player, this.meteorite], () => {
            ColisionDispatcher.elasticRebound(this.player, this.meteorite);
        });

        ColisionDispatcher.subscribe([this.player2, this.meteorite], () => {
            ColisionDispatcher.elasticRebound(this.player2, this.meteorite);
        });

        ColisionDispatcher.subscribe([this.goal, this.meteorite], () => {
            this.playersScore[1] += 1;
            this.updateScore();
        });

        ColisionDispatcher.subscribe([this.goal2, this.meteorite], () => {
            this.playersScore[0] += 1;
            this.updateScore();
        });

        this.entities = [
            this.player,
            this.player2,
            this.meteorite,
            this.goal,
            this.goal2,
        ];

        this.keysPressed = {};
        this.isStarted = false;

        document.addEventListener('keydown', (e) => {
            this.keysPressed[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keysPressed[e.key] = false;

            if (e.key === "p") {
                this.isStarted ? this.stop() : this.start();
            }
        });
    }

    private isKeyPressed(key: string) {
        return this.keysPressed[key] === true;
    }

    start() {
        this.isStarted = true;
        this.update();
    }

    stop() {
        this.isStarted = false;
    }

    initScoreElement() {
        this.scoreElement.style.color = "white";
        this.scoreElement.style.position = "fixed";
        this.scoreElement.style.left = "50vw";
        this.scoreElement.style.top = "5%";
        this.scoreElement.textContent = "0 - 0"
        document.body.appendChild(this.scoreElement);
    }

    updateScore() {
        this.scoreElement.textContent = `${this.playersScore[0]} - ${this.playersScore[1]}`;
    }

    handleKeyPressed() {
        if (this.isKeyPressed("w")) {
            this.player.addVelocity();
        }

        if (this.isKeyPressed("d") || this.isKeyPressed("a")) {
            if (this.isKeyPressed("d")) {
                this.player.increaseAngle();
            }

            if (this.isKeyPressed("a")) {
                this.player.decreaseAngle();
            }
        }

        if (this.isKeyPressed("ArrowUp")) {
            this.player2.addVelocity();
        }

        if (this.isKeyPressed("ArrowLeft") || this.isKeyPressed("ArrowRight")) {
            if (this.isKeyPressed("ArrowRight")) {
                this.player2.increaseAngle();
            }

            if (this.isKeyPressed("ArrowLeft")) {
                this.player2.decreaseAngle();
            }
        }

    }

    update() {
        this.handleKeyPressed();

        for (const entity of this.entities) {
            entity.updateSpeed();
            entity.updatePosition();
        }

        ColisionDispatcher.dispatchColision();

        this.scene.draw([this.player, ...this.entities]);

        if (this.isStarted) {
            requestAnimationFrame(() => this.update());
        }
    }
}