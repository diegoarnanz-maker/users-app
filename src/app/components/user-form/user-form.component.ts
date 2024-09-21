import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User;

  constructor( 
    private sharingData: SharingDataService,
    private route: ActivatedRoute,
    private service: UserService) {
    this.user = new User();
  }
  ngOnInit(): void {

    this.sharingData.selectedUserEventEmitter.subscribe((user: User) => {
      this.user = user;
    });
    
    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id') || '0');

      if(id>0){
        this.sharingData.findUserByIdEventemitter.emit(id);
        // this.service.findById(id).subscribe((user: User) => {
        //   this.user = user;
        // });
      }
    });
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      this.sharingData.newUserEventEmitter.emit(this.user);
      console.log(this.user);
    }
    userForm.reset();
    userForm.resetForm();
  }
  onFormat(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }
}
