import {Parser, SUPPORTED_FORMULAS} from 'hot-formula-parser'
interface Props {

}

function useParser(props: Props) {
    console.log({props})


    var parser = new Parser();
    let code_text_example = ` 
    TRANSFER(Age,Date,3)
    `

// parser.setFunction('TRANSFER', function (params) {
//     console.log({params})
//     return "done"
// });


    parser.on('callVariable', function (name, done) {
        if (name === 'Age') {
            done("Col");
        }
    });


    parser.on('callVariable', function (name, done) {
        if (name === 'Ali') {
            done("Col");
        }
    });

    parser.on('callVariable', function (name, done) {
        if (name === 'Date') {
            done("date");
        }
    });


    parser.on('callFunction', function (name, params, done) {
        console.log({name, params, done})
        if (name === 'TRANSFER') {
            done('hi');
        }
    });


    let v = parser.parse(code_text_example); // It returns `Object {error: null, result: 14}`
    console.log({v})

    return {parser}
}
export default useParser