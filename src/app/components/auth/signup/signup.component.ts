// noinspection ES6UnusedImports
import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Signup} from "../../../interfaces/auth/signup";
import {AuthService} from "../../../services/auth/auth.service";
import {APP_CONFIG, AppConfiguration, LangIso} from "../../../app.config";
import {UploadService} from "../../../services/upload/upload.service";
import {ImageSnippet} from "../../../interfaces/shared/image-snippet";
import {environment} from "../../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {circle, icon, latLng, MapOptions, marker, tileLayer} from 'leaflet';
import * as L from 'leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {LeafletControlLayersConfig} from "@asymmetrik/ngx-leaflet";
import {GeolocationService} from "../../../services/geolocation/geolocation.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  provider = new OpenStreetMapProvider();

  public signUpForm: any;

  countries: LangIso[];
  selectedFile!: ImageSnippet;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, @Inject(APP_CONFIG) config: AppConfiguration,
              private uploadService: UploadService, private toaster: ToastrService, private router: Router, private cdRef: ChangeDetectorRef,
              private geolocationService: GeolocationService) {
    this.countries = config.countryListISO;
  }

  get addAddress(): FormControl {
    return this.signUpForm.get('addAddress') as FormControl;
  }

  get username(): FormControl {
    return this.signUpForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.signUpForm.get('password') as FormControl;
  }

  get email(): FormControl {
    return this.signUpForm.get('email') as FormControl;
  }

  get address(): FormGroup {
    return this.signUpForm.get('address') as FormGroup;
  }

  get country(): FormControl {
    return this.address.get('country') as FormControl;
  }

  get administrativeArea(): FormControl {
    return this.address.get('administrativeArea') as FormControl;
  }

  get locality(): FormControl {
    return this.address.get('locality') as FormControl;
  }

  get dependentLocality(): FormControl {
    return this.address.get('dependentLocality') as FormControl;
  }

  get addressLine1(): FormControl {
    return this.address.get('addressLine1') as FormControl;
  }

  get addressLine2(): FormControl {
    return this.address.get('addressLine2') as FormControl;
  }

  get postalCode(): FormControl {
    return this.address.get('postalCode') as FormControl;
  }

  get profile(): FormGroup {
    return this.signUpForm.get('profile') as FormGroup;
  }

  get name(): FormControl {
    return this.profile.get('name') as FormControl;
  }

  get surname(): FormControl {
    return this.profile.get('surname') as FormControl;
  }

  get avatarUrl(): FormControl {
    return this.profile.get('avatarUrl') as FormControl;
  }

  get phoneNumber(): FormControl {
    return this.profile.get('phoneNumber') as FormControl;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  center = latLng(41.902782, 12.496366);

  options: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Open Street Map'})
    ],
    zoom: 15,
    center: this.center
  };
  layers: any = [
    circle([41.902782, 12.496366], {radius: 5000}),
    marker([41.902782, 12.496366], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
  ];

  ngOnInit(): void {
    console.log('ciao')
    this.signUpForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(120)]],
        surname: ['', [Validators.required, Validators.maxLength(120)]],
        avatarUrl: ['', Validators.maxLength(100)],
        phoneNumber: ['', Validators.maxLength(50)],
      }),
      addAddress: [false],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(320)]],
      address: this.formBuilder.group({
        country: ['IT'],
        administrativeArea: [''],
        locality: [''],
        dependentLocality: ['', [Validators.maxLength(100)]],
        addressLine1: ['', [Validators.maxLength(255)]],
        addressLine2: ['', [Validators.maxLength(255)]],
        postalCode: [''],
        lat: [''],
        lng: ['']
      })
    })

    this.addAddress.valueChanges.subscribe((value) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position => {
          this.center = latLng(position.coords.latitude, position.coords.longitude);
          this.layers[0] = circle([position.coords.latitude, position.coords.longitude], {radius: 10});
          this.layers[1] = marker([position.coords.latitude, position.coords.longitude], {
            icon: icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          })
        }));
      }
      this.country.setValidators(value ? [Validators.required, Validators.minLength(2), Validators.maxLength(2)] : null);
      this.administrativeArea.setValidators(value ? [Validators.required, Validators.maxLength(60)] : null);
      this.locality.setValidators(value ? [Validators.required, Validators.maxLength(100)] : null);
      this.postalCode.setValidators(value ? [Validators.required, Validators.maxLength(9)] : null);

      this.country.updateValueAndValidity();
      this.administrativeArea.updateValueAndValidity();
      this.locality.updateValueAndValidity();
      this.postalCode.updateValueAndValidity();
    })
  }


  signUp() {
    const formValue = this.signUpForm.value as Signup;

    if (!this.addAddress.value) {
      delete formValue.address;
    } else if(formValue.address) {
      formValue.address.lat = formValue.address.lat.toString();
      formValue.address.lng = formValue.address.lng.toString()
    }

    this.authService.signup(this.signUpForm.value as Signup).subscribe((createdUser) => {
      this.toaster.success('Registrazione completata correttamente! A breve sarai rendirizzato/a', 'Success')
      this.signUpForm.reset();

      setTimeout(async (): Promise<void> => {
        // after 1000 ms we add the class animated to the login/register card
        await this.router.navigate(['/auth/login']);
      }, 2000);
    }, error => {
      this.toaster.error(error.error.message, 'Errore')
    })
  }

  uploadImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      this.uploadService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.selectedFile.src = environment.baseUrl + ''
          this.onSuccess();
        },
        (err) => {
          this.onError();
        })
    });

    reader.readAsDataURL(file);
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  onMapReady(map: L.Map) {
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: this.provider,
      style: 'bar',
      autoCompleteDelay: 750,
      showPopup: true,
      maxMarkers: 1,
      searchLabel: 'Inserisci indirizzo',
      marker: {
        icon: new L.Icon.Default(),
        draggable: true,
      },
      updateMap: true
    });
    setTimeout(() => {
      map.addControl(searchControl);
    }, 0);

    map.on('geosearch/showlocation', ((event: any) => {
      this.address.patchValue({
        lat: event.marker._latlng.lat || '',
        lng: event.marker._latlng.lng || ''
      })

      this.geolocationService.lookup(event?.location?.raw?.osm_id, event?.location?.raw?.type).subscribe(data => {
        if(data.length > 0) {
          const a = data[0].address;
          this.address.patchValue({
            country: a?.country_code.toUpperCase() || '',
            administrativeArea: a?.province || '',
            locality: a?.city || '',
            dependentLocality: '',
            addressLine1: a?.road || '',
            addressLine2: '' || '',
            postalCode: a?.postcode || ''
          })
        }

      })
    }));

    map.on('geosearch/marker/dragend', (event => {

      this.address.patchValue({
        // @ts-ignore
        lat: event?.location?.lat,
        // @ts-ignore
        lng: event?.location?.lng
      })
    }));


  }
}
