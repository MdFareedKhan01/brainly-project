export function createHash(len: number){
    let options = "abcdefghijklmnopqrstuvwxyz0123456789";
    let n = options.length;
    let hash = ""
    for(let i=0;i<len;i++){
        let randomNum = Math.floor(Math.random()*(n));
        let char = options[randomNum];
        hash+=char;
    }
    return hash;
}