import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  user: User;

  constructor(private sharingData: SharingDataService) {
    this.user = new User();
  }

  OnSubmit() {
    if (!this.user.username || !this.user.password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor introduzca campos correctos!',
      });
    } else {
      this.sharingData.handlerLoginEventEmitter.emit({username: this.user.username, password: this.user.password});
    }
  }

}
