import * as fs from 'fs'
import { say } from 'cowsay';


console.log("Hello World!")

//  const words = ['unicorn', 'cupcake', 'rainbow', 'kitten'];
//  const output = words.join('\n');

 function fileWritten() {
   console.log('file written!');
 }

 const output = say ({ text: 'mooooo'});
 console.log(output)

 fs.writeFile('words.txt', output, fileWritten);