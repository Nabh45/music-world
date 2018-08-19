import React from 'react';
import { style } from '../style/style.css';

class ArtistList extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.totalRecordsPerPage = 2;
        this.state = {
            artistList: [],
            artistListOriginal: [],
            artistName: '',
            showModal: false,
            currentPageIndex: 0,
            lastPageIndex: 0,
            noRecordFound: false
        }
    }

    componentWillMount() {
        this.fetchArtistList();
    }

    //handles change in the search artist input box
    handleChange(e) {
        this.setState({
            artistName: e.target.value
        })
    }

    //handles on click method for search artist
    searchArtistByName() {
        this.fetchArtistList();
    }

    //fetching artist list if no artist name is passed and fetches artist details if artist detail is passed in url
    fetchArtistList() {
        var url = '';
        if (this.state.artistName) {
            url = 'https://www.theaudiodb.com/api/v1/json/1/search.php?s=' + this.state.artistName;
        } else {
            url = 'https://www.theaudiodb.com/api/v1/json/1/search.php?s=';
        }
        fetch(url)
            .then(res => {
                return res.json();
            }).then(data => {
                if (data.artists !== null) {
                    this.setState({
                        artistListOriginal: data.artists,
                        noRecordFound: false
                    }, () => {
                        this.setState({
                            artistList: this.state.artistListOriginal.slice(0, this.totalRecordsPerPage)
                        });
                        this.lastPageIndex();
                    });
                } else {
                    this.setState({
                        artistList: [],
                        noRecordFound: true
                    })
                }
            }).then(error => {
                console.log(error);
            })
    }

    //find last page index depending on the number of records in the artistListOriginal
    lastPageIndex() {
        var evenArrayLength = 0;
        if (this.state.artistListOriginal.length !== 2) {
            evenArrayLength = Math.floor(this.state.artistListOriginal.length / this.totalRecordsPerPage) - 1;
        }
        var oddArrayLength = (Math.floor(this.state.artistListOriginal.length / this.totalRecordsPerPage));
        if (this.state.artistListOriginal.length % this.totalRecordsPerPage == 0) {
            this.setState({
                lastPageIndex: evenArrayLength
            })
        } else {
            this.setState({
                lastPageIndex: oddArrayLength
            })
        }
    }

    //handles go to previous page
    handlePrevious(e) {
        var currentPage = this.state.currentPageIndex - 1;
        this.handlePagination(currentPage);
    }

    //handles go to next page
    handleNext(e) {
        var currentPage = this.state.currentPageIndex + 1;
        this.handlePagination(currentPage);
    }

    //handles go to first page
    handleGoToFirstPage() {
        var currentPage = 0;
        this.handlePagination(currentPage);
    }

    //handles go to last page
    handleGoToLastPage() {
        this.handlePagination(this.state.lastPageIndex);
    }

    //handles pagination taking the parameter currentPage on which user is on
    handlePagination(currentPage) {
        var startIndex = currentPage * this.totalRecordsPerPage;
        var endIndex = startIndex + this.totalRecordsPerPage;
        this.setState({
            currentPageIndex: currentPage
        }, () => {
            this.setState({
                artistList: this.state.artistListOriginal.slice(startIndex, endIndex)
            });
        });
    }

    render() {
        return (
            <div className='outerDiv'>

                <h1>Artist List</h1>

                <div className="contentSearch">
                    <label>Search By Artist Name</label>
                    <input className="inputBox" type="text" name="artistName" onChange={(e) => this.handleChange(e)} placeholder="Artist Name" />
                    <button onClick={(e) => this.searchArtistByName(e)}>Search</button>
                </div>

                {this.state.noRecordFound &&
                    <div>
                        <h2>No Artist Found</h2>
                    </div>
                }

                {this.state.artistList &&
                    <div>
                        {this.state.artistList.map((item, index) => (
                            <div className='outer clearfix' key={index}>
                                <div className='imgDiv'>
                                    <a><img alt="artistImage" style={{ width: '100%', height: 'auto' }} src={item.strArtistThumb ? item.strArtistThumb : "https://vignette.wikia.nocookie.net/community-sitcom/images/b/bd/Photo-Unavailable.jpg/revision/latest?cb=20130604203019"} /></a>
                                </div>
                                <div className='content'>
                                    <h2>{item.strArtist}</h2>
                                    <a href={"/artist/" + item.idArtist}>View Details</a>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                }

                <div className="buttonGroup">
                    <button disabled={this.state.currentPageIndex === 0} onClick={(e) => this.handleGoToFirstPage(e)}>&#60;&#60;</button>
                    <button disabled={this.state.currentPageIndex === 0} onClick={(e) => this.handlePrevious(e)}>&#60;</button>
                    <button disabled={this.state.currentPageIndex === this.state.lastPageIndex} onClick={(e) => this.handleNext(e)}>&#62;</button>
                    <button disabled={this.state.currentPageIndex === this.state.lastPageIndex} onClick={(e) => this.handleGoToLastPage(e)}>&#62;&#62;</button>
                </div>
            </div>
        )
    }
}

export default ArtistList;