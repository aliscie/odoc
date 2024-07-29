import "./App.css";
import OdocEditor from "@/components/pages/editor";
import createAmazingPlugin, {KEY_AMAZING} from "@/components/edtiro_compnents/amazing_com";
import {Icons} from "@/components/icons";
import {MyMentionItem} from "@/lib/plate/demo/values/mentionables";


const initialValue = [
    {
        id: "lkdf",
        type: 'h1',
        children: [{text: "This is a paragraph."}]
    },
    {
        id: "98ryw",
        type: 'amazing',
        children: [{text: "Amaing"}],
        data: "test",

    }
]

const mentions: MyMentionItem[] = [
    {key: '0', text: 'Aayla Secura'},
    {key: '1', text: 'Adi Gallia'},
    {
        key: '2',
        text: 'Admiral Dodd Rancit',
    },
    {
        key: '3',
        text: 'Admiral Firmus Piett',
    },
    {
        key: '4',
        text: 'Admiral Gial Ackbar',
    },
    {key: '5', text: 'Admiral Ozzel'},
    {key: '6', text: 'Admiral Raddus'},
    {
        key: '7',
        text: 'Admiral Terrinald Screed',
    },
    {key: '8', text: 'Admiral Trench'},
    {
        key: '9',
        text: 'Admiral U.O. Statura',
    },
    {key: '10', text: 'Agen Kolar'},
    {key: '11', text: 'Agent Kallus'},
    {
        key: '12',
        text: 'Aiolin and Morit Astarte',
    },
    {key: '13', text: 'Aks Moe'},
    {key: '14', text: 'Almec'},
    {key: '15', text: 'Alton Kastle'},
    {key: '16', text: 'Amee'},
    {key: '17', text: 'AP-5'},
    {key: '18', text: 'Armitage Hux'},
    {key: '19', text: 'Artoo'},
    {key: '20', text: 'Arvel Crynyd'},
    {key: '21', text: 'Asajj Ventress'},
    {key: '22', text: 'Aurra Sing'},
    {key: '23', text: 'AZI-3'},
    {key: '24', text: 'Bala-Tik'},
    {key: '25', text: 'Barada'},
    {key: '26', text: 'Bargwill Tomder'},
    {key: '27', text: 'Baron Papanoida'},
    {key: '28', text: 'Barriss Offee'},
    {key: '29', text: 'Baze Malbus'},
    {key: '30', text: 'Bazine Netal'},
    {key: '31', text: 'BB-8'},
    {key: '32', text: 'BB-9E'},
    {key: '33', text: 'Ben Quadinaros'},
    {key: '34', text: 'Berch Teller'},
    {key: '35', text: 'Beru Lars'},
    {key: '36', text: 'Bib Fortuna'},
    {
        key: '37',
        text: 'Biggs Darklighter',
    },
    {key: '38', text: 'Black Krrsantan'},
    {key: '39', text: 'Bo-Katan Kryze'},
    {key: '40', text: 'Boba Fett'},
    {key: '41', text: 'Bobbajo'},
    {key: '42', text: 'Bodhi Rook'},
    {key: '43', text: 'Borvo the Hutt'},
    {key: '44', text: 'Boss Nass'},
    {key: '45', text: 'Bossk'},
    {
        key: '46',
        text: 'Breha Antilles-Organa',
    },
    {key: '47', text: 'Bren Derlin'},
    {key: '48', text: 'Brendol Hux'},
    {key: '49', text: 'BT-1'},
];


function App() {
    // const initialValue = usePlaygroundValue(id);
    // const key = useInitialValueVersion(initialValue);

    let onInsertComponent = (component: any) => {
        console.log(component);
    };

    let onChange = (value: any) => {
        // console.log({value})
    };

    let extraPlugins = [
        {plugin: createAmazingPlugin, key: KEY_AMAZING, icon: Icons.kbd}
    ];


    return (
        <div className="flex items-start justify-center h-screen">
            <div className="w-5/6">
                <OdocEditor
                    extraPlugins={extraPlugins}
                    onChange={onChange}
                    userMentions={mentions}
                    onInsertComponent={onInsertComponent}
                    initialValue={initialValue} id="1"/>
            </div>
        </div>
    );
}

export default App;
