import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ReviewResponse {
  // animeId: string;
  user: string;
  rate: number;
  comment: string;
}

interface AnimeResponse {
  _id: string;
  name: string;
  episode: number;
  genre: string;
  imgUrl: string;
  trailerUrl: string;
  synopsis: string;
  type: string;
  studio: string;
  source: string;
}

@Component({
  selector: 'app-animereview',
  templateUrl: './animereview.component.html',
  styleUrls: ['./animereview.component.css']
})
export class AnimereviewComponent implements OnInit {

  randomAvatarNumber?: number;
  reviewData: ReviewResponse[] = []
  animeData: AnimeResponse[] = []
  avatarNumbers: number[] = [];
  // videoUrls?: any

  review = new FormGroup({
    comment: new FormControl(''),
    rate: new FormControl(0),
    // userId: new FormControl(''),
    animeId: new FormControl(''),
  });

  animeId: string | null;
  reviewUrl = 'http://localhost:5555/anime_review/rate/'
  animeUrl = 'http://localhost:5555/anime/detail/';

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private sanitizer: DomSanitizer
    ) {
    this.animeId = this.route.snapshot.paramMap.get('id');
  }


  ngOnInit(): void {
    // this.comment.userId = '561'
    this.randomAvatarNumber = this.getRandomAvatarNumber(1, 9);

    const token = sessionStorage.getItem('token');
    const user = localStorage.getItem('userId');

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    if (this.animeId !== null) {
      const reviewUrlbyId = `${this.reviewUrl}${this.animeId}`;
      const animeUrlbyId = `${this.animeUrl}${this.animeId}`;

      this.http.get<ReviewResponse[]>(reviewUrlbyId, { headers }).subscribe(
        (res) => {
          this.reviewData = res
          console.log("review")
          console.log(this.reviewData);
        });

      this.http.get<AnimeResponse[]>(animeUrlbyId).subscribe(
        (res) => {
          this.animeData = res
          console.log("anime")
          console.log(this.animeData)
          // if (this.animeData.length > 0 && this.animeData[0].videoUrl) {
          //   const videoUrl = `https://www.youtube.com/embed/${this.animeData[0].videoUrl}`;
          //   const safeVideoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
          //   this.videoUrls = safeVideoUrl;
          // } else {
          //   console.error('Invalid or missing videoUrl in animeData[0].');
          // }

          this.review.patchValue({
            animeId: this.animeData[0]._id, // Assuming there's at least one anime in the array
            // userId: user
          });
          const iframe = document.getElementById("animeTrailer") as HTMLIFrameElement;;
          if (iframe) {
            console.log(this.animeData[0].trailerUrl)
            iframe.src = this.animeData[0].trailerUrl;
          } else {
            console.warn("");
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Anime ID is null.');
    }
    for (let i = 0; i < 100; i++) {
      this.avatarNumbers.push(this.getRandomAvatarNumber(1, 9));
    }


  }

  fetchReviewData() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    const reviewUrlbyId = `${this.reviewUrl}${this.animeId}`;

    this.http.get<ReviewResponse[]>(reviewUrlbyId, { headers }).subscribe(
      (res) => {
        this.reviewData = res;
        console.log("review");
        console.log(this.reviewData);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getRandomAvatarNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  submitAnime() {
    const review = this.review.value;
    console.log('hahah', review)
    console.log('hahah',review)
    const token = sessionStorage.getItem('token');
    console.log(review)
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    this.http.post('http://localhost:5555/anime_review', review, { headers }).subscribe(
      (response) => {
        console.log('Anime posted successfully', response);
        this.resetForm();
        this.fetchReviewData(); // เรียกดึงข้อมูล Anime ใหม่หลังจากการโพสต์ Anime สำเร็จ

      },
      (error) => {
        console.error('Error posting anime', error);
        alert('Error: ' + error.message)
      }
    );


  }
  resetForm() {
    this.review.reset();
  }
}