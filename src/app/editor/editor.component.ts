import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
declare const Quill: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent  {
  @Input() value!: string;
  @Input() readOnly: boolean = false;
  @Input() placeholder: string = 'Place your content here';

  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('customEditor') customEditor!: ElementRef<HTMLDivElement>;

  quill!: typeof Quill;
  table: any;
  editorId:string;

  constructor() {
    this.value = '';
    this.editorId=this.getEditorID(10);
  }




  OnValueChange() {
    this.valueChange.emit(this.value);
  }

  ngAfterViewInit(): void {
    this.placeholder=this.value?'':this.placeholder;
    this.quill = new Quill(this.customEditor.nativeElement, {
      theme: 'snow',
      readOnly: this.readOnly,
      placeholder: this.placeholder,
      table: true,
      modules: {
        table: true,
        toolbar: [
          [
            'background',
            'code',
            'link',
            'bold',
            'italic',
            'underline',
            'strike',
          ], // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          [{ header: [] }],
          [{ size: [] }], // custom dropdown
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'], // remove formatting button
        ],
      },
    });
     this.quill.container.firstElementChild.innerHTML=this.value
    this.insertTableControls();
    this.table = this.quill.getModule('table');
    this.quill.on(
      'text-change',
      (_delta: any, _oldDelta: any, source: string) => {
        this.value = this.quill.container.innerHTML;
        this.OnValueChange();
      }
    );
  }

  insertTableControls() {
    let tableContainer = document.createElement('span');
    tableContainer.setAttribute('class', 'ql-formats');
    //table icon
    let tableIcon = document.createElement('i');
    tableIcon.setAttribute('class', 'table-icon-container');
    tableIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>
    </svg>`;
    tableIcon.title="Insert Table";
    tableContainer.appendChild(tableIcon);
    fromEvent(tableIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.insertTable(2, 2);
    });
    //insert column left icon
    let incolLeftIcon = document.createElement('i');
    incolLeftIcon.setAttribute('class', 'incolLeft-icon-container');
    incolLeftIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-Highlight {
            color:#3daee9;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 7 2 L 7 3 L 9 3 L 9 6 L 7 6 L 7 7 L 9 7 L 9 9 L 7 9 L 7 10 L 9 10 L 9 13 L 7 13 L 7 14 L 14 14 L 14 2 L 13 2 L 7 2 z M 10 3 L 13 3 L 13 6 L 10 6 L 10 3 z M 10 7 L 13 7 L 13 9 L 10 9 L 10 7 z M 6 10 L 2 12 L 6 14 L 6 10 z M 10 10 L 13 10 L 13 13 L 10 13 L 10 10 z " class="ColorScheme-Text"></path>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 7,2 6,2 6,3.281 4.719,2 3.281,2 6,4.719 l 0,2.563 -3,-3 0,-2.281 -1,0 0,7 1.719,0 L 3,8.282 3,5.719 6,8.719 6,9 7,9 7,3 Z" class="ColorScheme-Highlight"></path>
    </svg>`;
    incolLeftIcon.style.marginLeft="10px";
    incolLeftIcon.title="Insert Column Left";
    tableContainer.appendChild(incolLeftIcon);
    fromEvent(incolLeftIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.insertColumnLeft();
    });
    //insert column right icon
    let incolRightIcon = document.createElement('i');
    incolRightIcon.setAttribute('class', 'incolLeft-icon-container');
    incolRightIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-Highlight {
            color:#3daee9;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 2 2 L 2 14 L 9 14 L 9 13 L 7 13 L 7 10 L 9 10 L 9 9 L 7 9 L 7 7 L 9 7 L 9 6 L 7 6 L 7 3 L 9 3 L 9 2 L 3 2 L 2 2 z M 3 3 L 6 3 L 6 6 L 3 6 L 3 3 z M 3 7 L 6 7 L 6 9 L 3 9 L 3 7 z M 3 10 L 6 10 L 6 13 L 3 13 L 3 10 z M 10 10 L 10 14 L 14 12 L 10 10 z " class="ColorScheme-Text"></path>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 9,2 10,2 10,3.281 11.281,2 12.719,2 10,4.719 l 0,2.563 3,-3 0,-2.281 1,0 0,7 -1.719,0 L 13,8.282 13,5.719 10,8.719 10,9 9,9 9,3 Z" class="ColorScheme-Highlight"></path>
    </svg>`;
    incolRightIcon.style.marginLeft="10px";
    incolRightIcon.title="Insert Column Right";
    tableContainer.appendChild(incolRightIcon);
    fromEvent(incolRightIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.insertColumnRight();
    });
    //insert row above
    let inRowAboveIcon = document.createElement('i');
    inRowAboveIcon.setAttribute('class', 'incolLeft-icon-container');
    inRowAboveIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-Highlight {
            color:#3daee9;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 12 2 L 10 6 L 14 6 L 12 2 z M 2 7 L 2 13 L 2 14 L 14 14 L 14 7 L 13 7 L 13 9 L 10 9 L 10 7 L 9 7 L 9 9 L 7 9 L 7 7 L 6 7 L 6 9 L 3 9 L 3 7 L 2 7 z M 3 10 L 6 10 L 6 13 L 3 13 L 3 10 z M 7 10 L 9 10 L 9 13 L 7 13 L 7 10 z M 10 10 L 13 10 L 13 13 L 10 13 L 10 10 z " class="ColorScheme-Text"></path>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 2,7 2,6 3.281,6 2,4.719 2,3.281 4.719,6 l 2.563,0 -3,-3 -2.281,0 0,-1 7,0 0,1.719 L 8.282,3 5.719,3 8.719,6 9,6 9,7 3,7 Z" class="ColorScheme-Highlight"></path>
    </svg>`;
    inRowAboveIcon.style.marginLeft="10px";
    inRowAboveIcon.title="Insert Row Above";
    tableContainer.appendChild(inRowAboveIcon);
    fromEvent(inRowAboveIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.insertRowAbove();
    });
    //insert row below
    let inRowBelowIcon = document.createElement('i');
    inRowBelowIcon.setAttribute('class', 'incolLeft-icon-container');
    inRowBelowIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-Highlight {
            color:#3daee9;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 2 2 L 2 3 L 2 9 L 3 9 L 3 7 L 6 7 L 6 9 L 7 9 L 7 7 L 9 7 L 9 9 L 10 9 L 10 7 L 13 7 L 13 9 L 14 9 L 14 2 L 2 2 z M 3 3 L 6 3 L 6 6 L 3 6 L 3 3 z M 7 3 L 9 3 L 9 6 L 7 6 L 7 3 z M 10 3 L 13 3 L 13 6 L 10 6 L 10 3 z M 10 10 L 12 14 L 14 10 L 10 10 z " class="ColorScheme-Text"></path>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 2,9 2,10 3.281,10 2,11.281 2,12.719 4.719,10 l 2.563,0 -3,3 -2.281,0 0,1 7,0 0,-1.719 L 8.282,13 5.719,13 8.719,10 9,10 9,9 3,9 Z" class="ColorScheme-Highlight"></path>
    </svg>`;
    inRowBelowIcon.style.marginLeft="10px";
    inRowBelowIcon.title="Insert Row Below";
    tableContainer.appendChild(inRowBelowIcon);
    fromEvent(inRowBelowIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.insertRowBelow();
    });
    //insert row below
    let delRowIcon = document.createElement('i');
    delRowIcon.setAttribute('class', 'incolLeft-icon-container');
    delRowIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-NegativeText {
            color:#da4453;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 14,2 2,2 2,14 14,14 14,3 Z m -1,1 0,10 -3,0 0,-2 -1,0 0,2 -2,0 0,-2 -1,0 0,2 -3,0 0,-10 3,0 0,2 1,0 0,-2 2,0 0,2 1,0 0,-2 z" class="ColorScheme-Text"></path>
    <path d="M 13,5 3,5 3,6.719 6.281,10 3,10 l 0,1 10,0 0,-1 -1.281,0 -4,-4 2.563,0 2.719,2.719 0,-1.438 L 11.72,6 13.001,6 Z m -2.719,5 -2.563,0 -4,-4 2.563,0 z" style="fill:currentColor;fill-opacity:1;stroke:none" class="ColorScheme-NegativeText"></path>
    </svg>`;
    delRowIcon.style.marginLeft="10px";
    delRowIcon.title="Delete Row";
    tableContainer.appendChild(delRowIcon);
    fromEvent(delRowIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.deleteRow();
    });
    //insert row below
    let delColIcon = document.createElement('i');
    delColIcon.setAttribute('class', 'incolLeft-icon-container');
    delColIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="18" width="18">
    <defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
          .ColorScheme-Text {
            color:#232629;
          }
          .ColorScheme-NegativeText {
            color:#da4453;
          }
          </style>
    </defs>
    <path style="fill:currentColor;fill-opacity:1;stroke:none" d="m2 2v12h12v-12h-11zm1 1h10v3h-2v1h2v2h-2v1h2v3h-10v-3h2v-1h-2v-2h2v-1h-2z" class="ColorScheme-Text"></path>
     <path style="fill:currentColor;fill-opacity:1;stroke:none" d="m5 3v10h1.719l3.281-3.281v3.281h1v-10h-1v1.281l-4 4v-2.563l2.719-2.719h-1.438l-1.281 1.281v-1.281zm5 2.719v2.563l-4 4v-2.563z" class="ColorScheme-NegativeText"></path>
    </svg>`;
    delColIcon.style.marginLeft="10px";
    delColIcon.title="Delete Column";
    tableContainer.appendChild(delColIcon);
    fromEvent(delColIcon, 'click').subscribe(() => {
      this.quill.focus();
      this.table.deleteColumn();
    });

    document.querySelector('.custom_editor'+this.editorId)?.parentElement?.firstChild?.appendChild(tableContainer);
  }

  getEditorID(length: number) {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
