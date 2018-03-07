import { Directive, ElementRef, OnInit, OnDestroy, Input, Inject } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';
import { SCROLL_CONFIG, SCROLL_CONFIG_TOKEN } from './scroll.config';

@Directive({
  selector: '[appScroll]',
  providers: [
    {
      provide: SCROLL_CONFIG_TOKEN,
      useValue: SCROLL_CONFIG
    }
  ]
})
export class ScrollDirective implements OnInit, OnDestroy {

  public ps: PerfectScrollbar;

  @Input('appScroll')
  private appScroll: PerfectScrollbar.Options = {};

  constructor(
    @Inject(SCROLL_CONFIG_TOKEN) private readonly DEFAULT_OPTIONS: PerfectScrollbar.Options,
    public element: ElementRef
  ) {}

  ngOnInit() {
    const currentOptions = Object.assign({}, this.DEFAULT_OPTIONS, this.appScroll);
    this.ps = new PerfectScrollbar(this.element.nativeElement, currentOptions);
  }

  ngOnDestroy() {
    this.ps.destroy();
  }
}
