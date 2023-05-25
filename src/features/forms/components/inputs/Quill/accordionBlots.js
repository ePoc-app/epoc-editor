import { Quill } from '@vueup/vue-quill';

// // const Embed = Quill.import('blots/embed');
// const BlockEmbed = Quill.import('blots/block/embed');

// class AccordionBlots extends BlockEmbed {
//     static create(value) {
//         const node = super.create();

//         const details = document.createElement('details');
//         details.style.border = '1px solid lightgray';
//         details.style.borderRadius = '4px';
//         details.style.padding = '.5em .5em 0 .5em';

//         const summary = document.createElement('summary');
//         summary.style.fontWeight = 'bold';
//         summary.style.borderBottom = '1px solid lightgray';
//         summary.style.padding = '1em';
//         // summary.textContent = 'Titre';

//         const title = document.createElement('span');
//         title.textContent = 'Titre';

//         summary.appendChild(title);

//         // const title = document.createElement('p');
//         // // title.contentEditable = 'true';
//         // title.textContent = 'Titre';

//         // title.addEventListener('keydown', (event) => {
//         //     if(event.code === 'Space') {
//         //         event.preventDefault();
//         //         title.textContent += ' ';

//         //         const range = document.createRange();
//         //         const selection = window.getSelection();
//         //         range.selectNodeContents(title);
//         //         range.collapse(false);
//         //         selection.removeAllRanges();
//         //         selection.addRange(range);
//         //     }
//         // });

//         // summary.appendChild(title);

//         const content = document.createElement('div');
//         // content.contentEditable = true;
//         content.textContent = 'Contenu';

//         // content.addEventListener('keydown', (event) => {
//         //     if(event.code === 'Space') {
//         //         event.preventDefault();
//         //         content.textContent += ' ';

//         //         const range = document.createRange();
//         //         const selection = window.getSelection();
//         //         range.selectNodeContents(content);
//         //         range.collapse(false);
//         //         selection.removeAllRanges();
//         //         selection.addRange(range);
//         //     }
//         // })
//         //
//         content.addEventListener('keydown', (event) => {
//             console.log('kedown inside details');
//             event.preventDefault();
//             if(event.code === 'Backspace') {
//                 console.log('backspace detected');
//                 event.preventDefault();
//                 const index = this.parent.parent.children.indexOf(this.parent);
//                 console.log('index found:', index);
//                 if(index !== -1) {
//                     this.parent.parent.removeChild(index);
//                 }
//             } else {
//                 console.log('else');
//                 super.onKeyDown(event);
//             }
//         })
//         
//         details.appendChild(summary);
//         details.appendChild(content);


//         node.appendChild(details);

//         return node;
//         // const node = super.create();
//         // const html = 
//         // `<details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
//         //     <summary style="font-weight: bold; border-bottom: 1px solid lightgray; padding: 1em;" data-editable="true">
//         //         <p contenteditable="true">Titre</p>
//         //     </summary>
//         //     <div>
//         //         Contenu
//         //     </div>
//         // </details>`;
//         // node.innerHTML = html;
//         // return node;
//     }


//     // static value(node) {
//     //     const summary = node.querySelector('summary').textContent;
//     //     const content = node.querySelector('div').textContent;
//     //     return { title: summary, content };
//     // }
// }


// //@ts-ignore
// AccordionBlots.blotName = 'accordion';
// //@ts-ignore
// AccordionBlots.tagName = 'div';
// //@ts-ignore
// AccordionBlots.className = 'ql-accordion';

// Quill.register(AccordionBlots);
//


// class AccordionBlots extends Inline {
//     static create(value) {
//         const node = super.create();

//         if(value) {
//             node.setAttribute('open', value);
//         }

//         return node;
//     }

//     static formats(node) {
//         return node.hasAttribute('open');
//     }

//     format(name, value) {
//         if(name === 'details') {
//             this.domNode.setAttribute('open', value);
//         } else {
//             super.format(name, value);
//         }
//     }

//     formats() {
//         const formats = super.formats();
//         formats['details'] = AccordionBlots.formats(this.domNode);
//         return formats;
//     }
// }
//

// const Inline = Quill.import('blots/inline');
// class AccordionBlots extends Inline {
//     static create() {
//         const node = super.create();

//         const html = `
//             <details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
//                 <summary style="font-weight: bold; border-bottom: 1px solid lightgray; padding: 1em;" data-editable="true">
//                     Titre
//                 </summary>
//                 <div>
//                     Contenu
//                 </div>
//             </details>`;
//         node.innerHTML = html;

//         return node;
//     }
// }

// AccordionBlots.blotName = 'accordion';

// Quill.register(AccordionBlots);

const BlockEmbed = Quill.import('blots/block/embed');
class AccordionBlots extends BlockEmbed {
    static create(value) {
        const node = super.create();

        const html = `
            <details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
                <summary style="font-weight: bold; border-bottom: 1px solid lightgray; padding: 1em;" data-editable="true">
                    Titre
                </summary>
                <div>
                    Contenu
                </div>
            </details>`;

        node.innerHTML = html;

        return node;
    }
}

AccordionBlots.blotName = 'accordion';

Quill.register(AccordionBlots);
