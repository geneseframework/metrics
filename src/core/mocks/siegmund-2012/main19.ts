

// 19. Capitalize first letter of word
function main19(args: string[]): void {
    let s = "here are a bunch of words";

    // @ts-ignore
    let result = new StringBuilder(s.length);

    let words: string[] = s.split("\\s");
    for(let i=0,l=words.length;i<l;++i) {
        if(i>0) result.append(" ");
        // @ts-ignore
        result.append(Character.toUpperCase(words[i].charAt(0)))
            .append(words[i].substring(1)); // Note: a ")" had to be added here to allow compilation
    }
    console.log(result);
}

