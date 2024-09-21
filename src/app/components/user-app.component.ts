import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { state } from '@angular/animations';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css'],
})
export class UserAppComponent implements OnInit {

  users: User[] = [];
  paginator: any = {};

  // userEdit: User;

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.userEdit = new User();
  }
  ngOnInit(): void {
    // this.service.findAll().subscribe(users => this.users = users);

    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page') || "0");
    //   console.log(page);

    //   // this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // });

    this.addUser();
    this.removeUser();
    // this.setEditUser();
    this.findUserById();
    this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingData.handlerLoginEventEmitter.subscribe(({ username, password }) => {
      console.log(username + " " + password);
  
      this.authService.loginUser({ username, password }).subscribe({
        next: response => {
          const token = response.token;
          console.log(token);
          // const payload = JSON.parse(atob(token.split(".")[1]));
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub};

          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin,
          }
          // sessionStorage.setItem('login', JSON.stringify(login));
          // sessionStorage.setItem('token', token);
          //lo mandamos al auth service
          this.authService.user = login;
          this.authService.token = token;
          
          this.router.navigate(['/users/page/0']);
          // console.log(payload);
        },
        error: error => {
          if (error.status == 401) {
            // console.log(error.error);
            Swal.fire('Error en el login', error.error.message, 'error');
          } else {
            throw error;
          }
        }
      });
    });
  }
  

  pageUsersEvent() {
    this.sharingData.pageUsersEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe((user: User) => {
      if (user.id > 0) {
        this.service.update(user).subscribe(userUpdated => {
          this.users = this.users.map(u => (u.id === userUpdated.id) ? { ...userUpdated } : u);
          this.router.navigate(['/users'], {
            state: {
              users: this.users,
              paginator: this.paginator
            }
          });
        });

      } else {
        this.service.create(user).subscribe(userCreated => {
          this.users = [... this.users, { ...userCreated }];
          this.router.navigate(['/users'], {
            state: {
              users: this.users,
              paginator: this.paginator
            }
          });
        });

      }


      // this.userEdit = new User();
      Swal.fire({
        title: "Guardado!",
        text: "Se ha guardado con éxito",
        icon: "success"
      });
    });

  }

  removeUser() {
    this.sharingData.idUserEventemitter.subscribe((id: number) => {
      Swal.fire({
        title: "¿Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {


          this.service.remove(id).subscribe(() => {
            this.users = this.users.filter(user => user.id !== id);
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], {
                state: {
                  users: this.users,
                  paginator: this.paginator
                }
              })

              Swal.fire({
                title: "Eliminado!",
                text: "Usuario eliminado.",
                icon: "success",
              });
            });
          });
        }
      });
    });
  }


  // setEditUser() {
  //   this.sharingData.editUserEventemitter.subscribe((userRow: User) => {
  //     this.userEdit = {... userRow};
  //   });
  //   }

  findUserById() {
    this.sharingData.findUserByIdEventemitter.subscribe((id: number) => {
      const user = this.users.find(user => user.id === id);
      // this.sharingData.newUserEventEmitter.emit(user);

      this.sharingData.selectedUserEventEmitter.emit(user);
    });
  }

}
