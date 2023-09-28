import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface AnimeResponse {
  name: string;
  episode: number;
  genre:string;
  imgUrl:string;
}

@Component({
  selector: 'app-animelist',
  templateUrl: './animelist.component.html',
  styleUrls: ['./animelist.component.css']
})

export class AnimelistComponent implements OnInit {

  // data!: string;
  data: AnimeResponse[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    const url = 'http://localhost:5555/anime';
    this.http.get<AnimeResponse[]>(url).subscribe(
      (res) => {
        console.log('Response data:', res);
        this.data = res
        console.log(this.data)
        this.addNewPost();
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }

  // Function to create a new card element
  createCard(data: AnimeResponse): HTMLElement {
    console.log("data")
    const card = document.createElement("div");
    card.className = "col-lg-6";
    card.innerHTML = `
        <div class="card mb-4">
            <a href="#!"><img class="card-img-top" src="${data.imgUrl}" alt="..." /></a>
            <div class="card-body">
            <div class="small text-muted">${data.genre}</div>
            <h2 class="card-title h4">${data.name}</h2>
            <p class="card-text">${data.episode} episodes</p>
                <a class="btn btn-primary" href="#!">Read more →</a>
            </div>
        </div>
    `;
    return card;
  }

  addNewPost(): void {
    const AnimeResponse = document.getElementById("card-anime");
    if (AnimeResponse) {
      this.data.forEach((item) => {
        const newCard = this.createCard(item);
        AnimeResponse.appendChild(newCard);
      })
    }
  }
}
