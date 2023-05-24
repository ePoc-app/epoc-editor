import { Quill } from '@vueup/vue-quill';

const Embed = Quill.import('blots/embed');

class AccordionBlots extends Embed {
    static create(value) {
        const node = super.create();
        const html = 
        `<details style="border: 1px solid lightgray; border-radius: 4px; padding: .5em .5em 0 .5em">
            <summary style="font-weight: bold" data-editable="true">
                ${value.title}
            </summary>
            <div>
                ${value.content}
            </div>
        </details>`;
        node.innerHTML = html;
        return node;
    }

    static value(node) {
        const summary = node.querySelector('summary').textContent;
        const content = node.querySelector('div').textContent;
        return { title: summary, content };
    }
}

//@ts-ignore
AccordionBlots.blotName = 'accordion';
//@ts-ignore
AccordionBlots.tagName = 'div';
//@ts-ignore
AccordionBlots.className = 'ql-accordion';

Quill.register(AccordionBlots);