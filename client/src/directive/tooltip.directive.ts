import * as _ from 'lodash';
import {Directive, ElementRef, Input, NgZone} from "@angular/core";

@Directive({
    selector: '[tooltip]',
    host: {
        '(mouseenter)': 'onMouseEnter($event)',
        '(mouseleave)': 'onMouseLeave()',
        '(mousemove)': 'onMouseMove($event)',
    }
})
export class Tooltip {
    public static container:any;

    @Input('tooltip') opts:any;

    html:string;

    constructor(private _ngZone:NgZone) {
    }

    ngOnInit() {
        if (!Tooltip.container) {
            this._injectTooltip();
        }

        if (this.opts.template) {
            this.html = _.template(require('../' + this.opts.template))(this.opts.templateData);
        } else {
            this.html = '<div class="guardian-tooltip guardian-default-tooltip">' + this.opts.message + '</div>';
        }
    }

    ngOnDestroy() {
        if (!Tooltip.container) {
            return;
        }
        this._ngZone.runOutsideAngular(() => {
            Tooltip.container.style.display = 'none';
        });
    }

    onMouseLeave() {
        this._ngZone.runOutsideAngular(() => {
            Tooltip.container.style.display = 'none';
        });
    }

    onMouseEnter(event) {
        this._ngZone.runOutsideAngular(() => {
            this._position(event);

            Tooltip.container.style.display = 'block';
            Tooltip.container.innerHTML = this.html;
        });
    }

    onMouseMove(event) {
        if (!Tooltip.container) {
            return;
        }

        this._position(event);
    }

    private _injectTooltip() {
        this._ngZone.runOutsideAngular(() => {
            Tooltip.container = document.createElement('div');
            Tooltip.container.className = 'opentip-container';
            Tooltip.container.style.position = 'absolute';
            Tooltip.container.style.display = 'none';

            document.querySelector('body').appendChild(Tooltip.container);
        });
    }

    private _position(event) {
        this._ngZone.runOutsideAngular(() => {
            let padding = 5;
            let y = event.pageY;
            let x = event.pageX;

            let bodyX = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + document.body.scrollLeft - 40;
            let bodyY = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + document.body.scrollTop - 40;

            let errorY = y + Tooltip.container.offsetHeight > bodyY;
            let errorX = x + Tooltip.container.offsetWidth > bodyX;

            let anchor: any = {
                bottomleft: {
                    y: (y - Tooltip.container.offsetHeight) + padding + 'px',
                    x: x + padding + 'px'
                },
                bottomright: {
                    y: (y - Tooltip.container.offsetHeight) + padding + 'px',
                    x: (x - Tooltip.container.offsetWidth) + padding + 'px'
                },
                topleft: {
                    y: y + padding + 'px',
                    x: x + padding + 'px'
                },
                topright: {
                    y: y + padding + 'px',
                    x: (x - Tooltip.container.offsetWidth) + padding + 'px'
                }
            };

            if (this.opts.anchor) {
                Tooltip.container.style.top = anchor[this.opts.anchor].y;
                Tooltip.container.style.left = anchor[this.opts.anchor].x;
            } else {
                if (errorY && !errorX) {
                    Tooltip.container.style.top = anchor.bottomleft.y;
                    Tooltip.container.style.left = anchor.bottomleft.x;

                } else if (!errorY && errorX) {
                    Tooltip.container.style.top = anchor.topright.y;
                    Tooltip.container.style.left = anchor.topright.x;

                } else if (errorY && errorX) {
                    Tooltip.container.style.top = anchor.bottomright.y;
                    Tooltip.container.style.left = anchor.bottomright.x;

                } else {
                    Tooltip.container.style.top = anchor.topleft.y;
                    Tooltip.container.style.left = anchor.topleft.x;
                }
            }
        });
    }
}
