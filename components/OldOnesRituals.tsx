import React from 'react';

const RitualCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-[var(--color-accent-400)]/20 rounded-lg p-6 shadow-lg mb-6">
        <h3 className="text-2xl font-serif font-semibold text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] mb-4">{title}</h3>
        <div className="space-y-4 text-gray-800 dark:text-gray-300">{children}</div>
    </div>
);

const Invocation: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div>
        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{title}</h4>
        <blockquote className="border-l-4 border-[var(--color-accent-500)] dark:border-[var(--color-accent-400)] pl-4 italic my-2">
            {text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </blockquote>
    </div>
);

export const OldOnesRituals: React.FC = () => {
    return (
        <div className="p-1">
             <blockquote className="mb-8 p-4 border-l-4 border-[var(--color-accent-600)] dark:border-[var(--color-accent-400)] bg-white/50 dark:bg-gray-800/50 rounded-r-lg shadow">
                <p className="font-serif italic text-gray-700 dark:text-gray-300">
                   "Herein are contained rituals from a different tradition, that of the Old Ones. These rites require no special implements but rely on the power of specific words and intentions. They are provided for the adept to explore diverse currents of power."
                </p>
            </blockquote>

            <RitualCard title="The Titanic Bring-Me-Wealth Ritual">
                <p>This ritual is designed to multiply your existing assets. Och is a Genius of Gold who can bring wealth to you, rather than jewels and gifts.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Carry out the Ritual of the Old Ones up to the Calling.</li>
                    <li>Recite the Call to Cthulhu three times.</li>
                    <li>Announce the Purpose of Your Call, once: <em className="font-semibold">"I do this to be blessed with enough material wealth to last me the rest of my days."</em></li>
                    <li>Turning counter-clockwise, firmly speak the Word of Power to the Four Corners of the room: <strong className="font-bold tracking-widest">OCH</strong>.</li>
                     <li>Facing north again, recite the Arcane Invocation once.</li>
                </ol>
                <Invocation title="Arcane Invocation" text={"Spirit of the Earth, Give Power!\nSpirit of the Sky, Give Power!\nSpirit of the Water, Give Power!\nSpirit of the Flame, Give Power!"} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Repeat this Ritual for six consecutive days or until your desire is granted, whichever is sooner.</p>
            </RitualCard>

            <RitualCard title="The Incredible Bring-Me-Success Ritual">
                 <p>This ritual is to carry you forward to the pinnacle of success.</p>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Carry out the Ritual of the Old Ones up to the Calling.</li>
                    <li>Recite the Call to Cthulhu three times.</li>
                    <li>Announce the Purpose of Your Call, once: <em className="font-semibold">"I do this to be carried forward to the pinnacle of success."</em></li>
                    <li>Turning counter-clockwise, firmly speak the Word of Power to the Four Corners of the room: <strong className="font-bold tracking-widest">ZORAMI</strong>.</li>
                     <li>Facing north again, recite the Arcane Invocation once.</li>
                </ol>
                 <Invocation title="Arcane Invocation" text={"Spirit of the Earth, Give Power!\nSpirit of the Sky, Give Power!\nSpirit of the Water, Give Power!\nSpirit of the Flame, Give Power!"} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Repeat this Ritual for six consecutive days or until your desire is granted, whichever is sooner.</p>
            </RitualCard>
            
            <RitualCard title="The Superb Bring-Me-Luck Spell">
                <p>This spell is designed to turn luck vibrations your way in contests where numbers are the chief factor in winning.</p>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>As soon as possible after waking, write down on a piece of paper how many lucky numbers you need (e.g., "I need six numbers to win").</li>
                    <li>Draw a triangle around the statement. At the corners, write "Ku" (bottom-left), "Tu" (top), and "Lu" (bottom-right).</li>
                    <li>Keep this paper with you for at least 9 hours, reading it as often as possible when unobserved.</li>
                    <li>After darkness has fallen, carry out the Ritual of the Old Ones up to the Calling.</li>
                    <li>Recite the Calling three times, either aloud or in your mind.</li>
                </ol>
                <Invocation title="Calling for Luck" text={"In the Power of the Words ROKES PILATUS ZOTOAS\nI direct the invisible servitors of Shub-Niggurath to shape the future such,\nThat lucky numbers shall be revealed to me\nDuring both waking and sleeping.\nI seal this Calling with the Words TULITAS ZATANITOS.\nBe it so."} />
                <p>After the final recitation, tear the paper into tiny pieces and throw them away in running water.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Repeat this Spell each night for six days or until the lucky numbers are revealed to you, whichever is sooner.</p>
            </RitualCard>

        </div>
    );
};
