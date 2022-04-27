import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
declare const Quill: any;
declare const quillBetterTable:any;

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

  ngOnChanges(changes:SimpleChanges){
    let readOnlyChange:SimpleChange=changes['readOnly'];
    let valueChange:SimpleChange=changes['value'];
    if(readOnlyChange){
      if(typeof readOnlyChange.currentValue=='boolean'){
        if(this.quill){
          this.quill.enable(!this.readOnly)
        }
      }
    }
    if(valueChange){
      if(valueChange.currentValue && this.quill){
        this.quill.root.innerHTML=this.value;
      }
    }
  }


  InitializeQuill(){
    this.quill = new Quill(this.customEditor.nativeElement, {
      theme: 'snow',
      readOnly: this.readOnly,
      placeholder: this.placeholder,
      table: true,
      modules: {
        table: false,
        'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name'
              }
            }
          }
        },
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
    this.quill.root.innerHTML=this.value;
    this.insertTableControls();
    this.table = this.quill.getModule('better-table');
    this.quill.on(
      'text-change',
      (_delta: any, _oldDelta: any, source: string) => {
        this.value = this.quill.root.innerHTML;
        this.valueChange.emit(this.value);
      }
    );
  }
  ngAfterViewInit(): void {
    this.placeholder=this.value?'':this.placeholder;
    Quill.register({
      'modules/better-table': quillBetterTable
    }, true);
    this.InitializeQuill();
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
