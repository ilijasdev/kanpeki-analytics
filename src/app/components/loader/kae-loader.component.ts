import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'kae-spinner',
	template: '<div id="kae-spinner-element"></div>',
	styles: [
		`
		#kae-spinner-element {
			display: inline-block;
			width: 20px;
	    height: 20px;
	    border: 2px solid #2edb89;
		  border-radius: 50%;
		  border-top-color: #fff;
		  animation: spin 0.6s ease-in-out infinite;
		  -webkit-animation: spin 0.6s ease-in-out infinite;
		  color: #9FA2B4;
			vertical-align: bottom;
			padding-left: 10px;
		}

		@keyframes spin {
		  to { -webkit-transform: rotate(360deg); }
		}
		@-webkit-keyframes spin {
		  to { -webkit-transform: rotate(360deg); }
		}
		`
	],
	encapsulation: ViewEncapsulation.None
})
export class KaeSpinnerComponent {
	el: HTMLElement;
	constructor(ref: ElementRef) { this.el = ref.nativeElement; }
}
