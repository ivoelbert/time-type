import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const TIME_SPEED = 2;
const LINE_HEIGHT = 40;

export const App: React.FC = () => {
    const readWriteButton = useRef<HTMLButtonElement>(null!);
    const clearButton = useRef<HTMLButtonElement>(null!);

    const [isTyping, setIsTyping] = useState<boolean>(true);
    const [letters, setLetters] = useState<Letter[]>([]);

    const onFooterClick = () => {
        readWriteButton.current.blur();
        setIsTyping((t) => !t);
    };

    const clear = () => {
        clearButton.current.blur();
        setLetters([]);
    };

    return (
        <div className="App">
            <header className="header">Just write</header>
            {isTyping ? (
                <Writing letters={letters} setLetters={setLetters} />
            ) : (
                <Reading letters={letters} />
            )}
            <button ref={readWriteButton} onClick={onFooterClick}>
                {isTyping ? "read" : "write"}
            </button>
            <button ref={clearButton} onClick={clear}>
                clear
            </button>
        </div>
    );
};

interface ReadingProps {
    letters: Letter[];
}

const Reading: React.FC<ReadingProps> = (props) => {
    const text = props.letters.map((l) => l.letter).join("");

    return <div className="writing-container">{text}</div>;
};

interface Letter {
    time: number;
    letter: string;
}

interface WritingProps {
    letters: Letter[];
    setLetters: React.Dispatch<React.SetStateAction<Letter[]>>;
}

const Writing: React.FC<WritingProps> = (props) => {
    const { letters, setLetters } = props;
    const container = useRef<HTMLDivElement>(null!);
    const caret = useRef<HTMLDivElement>(null!);
    const startingPoint =
        letters[letters.length - 1] !== undefined
            ? letters[letters.length - 1].time + TIME_SPEED * 5
            : 0;
    const caretTravel = useRef<number>(startingPoint);

    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [isMoving, setIsMoving] = useState<boolean>(false);

    const getPosition = useCallback(
        (time: number): [number, number] => {
            const px = time % containerWidth;
            const py = Math.floor(time / containerWidth) * LINE_HEIGHT;
            return [px, py];
        },
        [containerWidth]
    );

    useEffect(() => {
        if (letters.length === 0) {
            caretTravel.current = 0;
        }
    }, [letters]);

    useEffect(() => {
        setContainerWidth(container.current.clientWidth);

        const resizeHandler = () => {
            setContainerWidth(container.current.clientWidth);
        };

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.preventDefault();
            setIsMoving(true);

            if (e.key === " ") {
                caretTravel.current += TIME_SPEED * 2;
            }

            const time = caretTravel.current;
            const letter = e.key;

            const newLetter: Letter = { time, letter };

            setLetters((l) => [...l, newLetter]);
        };

        window.addEventListener("keypress", handler);

        return () => {
            window.removeEventListener("keypress", handler);
        };
    }, [isMoving, setLetters]);

    useEffect(() => {
        const downHandler = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                setIsMoving(true);
                if (letters.length <= 1) {
                    setLetters([]);
                    setIsMoving(false);
                    return;
                }

                const { time } = letters[letters.length - 1] ?? { time: 0 };
                setLetters((l) => l.slice(0, l.length - 1));
                caretTravel.current = time;
            }
        };

        window.addEventListener("keydown", downHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [isMoving, letters, setLetters]);

    useEffect(() => {
        let rafID = 0;

        const loop = () => {
            rafID = requestAnimationFrame(loop);

            if (isMoving) {
                caretTravel.current += TIME_SPEED;
            }

            const [px, py] = getPosition(caretTravel.current);
            caret.current.style.transform = `translate(${px}px, ${py}px)`;
        };

        loop();

        return () => {
            cancelAnimationFrame(rafID);
        };
    }, [getPosition, isMoving]);

    const letterElements = useMemo(
        () =>
            letters.map((l, idx) => {
                const { time, letter } = l;
                const [px, py] = getPosition(time);

                const style: React.CSSProperties = {
                    transform: `translate(${px}px, ${py}px)`,
                };

                return (
                    <div className="letter" style={style} key={idx}>
                        {letter}
                    </div>
                );
            }),
        [getPosition, letters]
    );

    return (
        <div className="writing-container" ref={container}>
            <div className="caret" ref={caret}></div>
            {letterElements}
        </div>
    );
};
