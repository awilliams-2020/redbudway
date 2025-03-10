import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSquareCaretDown, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faPlus,
  faQuestion,
  faSkullCrossbones,
  faEnvelope as fasEnvelope,
  faAngleLeft,
  faMinus,
  faCircleCheck,
  faCircleXmark,
  faLocationCrosshairs,
  faEye,
  faEyeSlash,
  faRepeat,
  faBriefcase,
  faAngleUp,
  faAngleDown,
  faPenToSquare,
  faCheck,
  faXmark,
  faCaretRight,
  faCaretLeft,
  faLink,
  faShareAlt,
  faTrashCan,
  faGlobe,
  faCartShopping,
  faICursor,
  faAlignLeft,
  faLocationDot,
  faPhone
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    FontAwesomeModule
  ]
})
export class IconsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faPhone,
      faLocationDot,
      faFacebook,
      faLinkedin,
      faTwitter,
      faEnvelope,
      faPlus,
      faQuestion,
      faSkullCrossbones,
      fasEnvelope,
      faAngleLeft,
      faCircleCheck,
      faCircleXmark,
      faMinus,
      faLocationCrosshairs,
      faEye,
      faEyeSlash,
      faRepeat,
      faBriefcase,
      faAngleUp,
      faAngleDown,
      faPenToSquare,
      faCheck,
      faXmark,
      faCaretRight,
      faCaretLeft,
      faLink,
      faShareAlt,
      faTrashCan,
      faGlobe,
      faCartShopping,
      faSquareCaretDown,
      faSquareCheck,
      faICursor,
      faAlignLeft
    )
  }
}
