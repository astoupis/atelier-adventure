// Joke module
const jokes = {
    joke0: "I told myself that I should stop drinking, but then I thought, why should I listen to some drunken idiot who talks to himself?!",
    joke1: "Always writing my name in cursive is my signature move",
    joke2: "Today, my son asked \"Can I have a book mark?\" and I burst into tears.\n11 years old and he still doesn't know my name is Brian.",
    joke3: "I’d tell you a Fibonacci joke, but’s it’s probably as bad as the last two you’ve heard combined",
    joke4: "What did one Italian say to another when fighting? \n -‘You wanna pizza me?'",
    joke5: "What do you call an illegal piece of fish? \n -Cod-traband",
    joke6: "If you drop 1000ml of rubbish on the pavement, you're litre-ing",
    joke7: "Where do URLs go for drinks? \n The address bar!",
    joke8: "What do you get when you remove all the iron from a Ferrari? \n A rrari",
    joke9: "What's 2 x 2? \n -Mathematician: 4 \n -Physicist: 4.0 \n -Statistician: 4 with an error of 0.1 either way \n -Engineer: About 4, but I'll say 6 to be on the safe side"
};

module.exports = {
    getJoke: function getJoke () {
        // generate a random integer number in the interval [0, 10)
        let random = Math.floor(Math.random() * 10);
        return jokes["joke" + random];
    }
}