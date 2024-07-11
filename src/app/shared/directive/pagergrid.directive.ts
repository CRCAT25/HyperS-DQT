import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[pagerGrid]',
})

export class PagerGridDirective implements AfterViewInit, OnInit {
    constructor(private element: ElementRef) { }
    ngOnInit(): void {
        const element = this.element.nativeElement as HTMLElement;
        if (element) {
            const pagesButton = element.querySelector('kendo-svgicon.k-svg-i-caret-alt-to-left');
            if(pagesButton){
                console.log(pagesButton);
            }
        }
    }
    ngAfterViewInit(): void {
        const element = this.element.nativeElement as HTMLElement;
        if (element) {
            const label = element.querySelector('.k-label');
            if(label){
                label.innerHTML = 'Hiển thị mỗi trang';
            }
            const pagesButton = element.querySelector('kendo-svgicon.k-svg-i-caret-alt-to-left');
            if(pagesButton){
                console.log(pagesButton);
            }
        }
    }
}