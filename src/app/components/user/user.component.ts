import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule, PaginatorComponent],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  title: string = 'Listado de usuarios';

  pageUrl: string = '/users/page';

  users: User[] = [];

  paginator: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
    private authService: AuthService,
    private sharingData: SharingDataService,
    ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }

  }

  ngOnInit(): void {
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      // this.service.findAll().subscribe((users) => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || "0");
        console.log(page);
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[];
          this.paginator = pageable;
          this.sharingData.pageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      });
    }
  }

  onRemove(id: number): void {
    // const confirmRemove = confirm('Estas seguro de eliminar este contacto?');
    // if(confirmRemove){
    //   this.idUserEventemitter.emit(id);
    // }
    this.sharingData.idUserEventemitter.emit(id);

  }

  oneditUser(user: User): void {
    // this.sharingData.editUserEventemitter.emit(user);
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
