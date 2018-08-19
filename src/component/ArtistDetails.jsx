import React from 'react';
import { Modal } from 'react-bootstrap';

class ArtistDetails extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.totalRecordsPerPage = 2;
        this.state = {
            artistDetail: [],
            artistAlbum: [],
            trackList: [],
            originalArtistAlbum: [],
            artistId: '',
            albumId: '',
            releasedDate: '',
            currentPageIndex: 0,
            lastPageIndex: 0,
            showModal: false,
            noAlbumsFound: false,
            noTracksFound: false
        };
    }

    componentWillMount() {
        this.setState({
            artistId: this.props.match.params.id
        }, () => {
            this.fetchArtistDetails();
            this.fetchAlbums();
        })
    }

    // fetching the artist details taking artist id as a parameter
    fetchArtistDetails() {
        var url = 'https://www.theaudiodb.com/api/v1/json/1/artist.php?i=' + this.state.artistId;
        fetch(url)
            .then(res => {
                return res.json();
            }).then(data => {
                this.setState({
                    artistDetail: data.artists[0]
                })
            }).then(err => {
                console.log(err);
            })
    }

    //fetching the artist albums taking artist id as a parameter
    fetchAlbums() {
        var url = "http://www.theaudiodb.com/api/v1/json/1/album.php?i=" + this.state.artistId;
        fetch(url)
            .then(res => {
                return res.json();
            }).then(data => {
                if (data.album !== null) {
                    this.setState({
                        originalArtistAlbum: data.album,
                        noAlbumsFound: false
                    }, () => {
                        this.setState({
                            artistAlbum: this.state.originalArtistAlbum.slice(0, this.totalRecordsPerPage)
                        });
                        this.lastPageIndex();
                    })
                } else {
                    this.setState({
                        noAlbumsFound: true
                    })
                }
            }).then(err => {
                console.log(err);
            })
    }

    //fetch tracks related to a particular album taking albumm id as a parameter
    fetchAlbumTracks(e, item) {
        this.setState({
            releasedDate: item.intYearReleased,
            album: item.strAlbum
        })
        var url = "https://www.theaudiodb.com/api/v1/json/1/track.php?m=2129654&m=" + item.idAlbum;
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data !== 'undefined' || data.tracks !== null) {
                    this.setState({
                        trackList: data.track,
                        noTracksFound: false
                    }, () => {
                        this.showModal();
                    })
                } else {
                    this.setState({
                        noTracksFound: true
                    })
                }
            })
            .then(err => {
                console.log(err);
            })
    }

    //sets the showModal to true and shows the Tracks Modal
    showModal(item) {
        this.setState({
            showModal: true
        })
    }

    //sets the showModal to false and albumId back to null
    closeModel() {
        this.setState({
            showModal: false,
            albumId: '',
        });
    }

    //finds the index of last page depending on the number of records in the originalArtistAlbum
    lastPageIndex() {
        var evenArrayLength = 0;
        if (this.state.originalArtistAlbum.length !== 2) {
            evenArrayLength = Math.floor(this.state.originalArtistAlbum.length / this.totalRecordsPerPage) - 1;
        }
        var oddArrayLength = (Math.floor(this.state.originalArtistAlbum.length / this.totalRecordsPerPage));
        if (this.state.originalArtistAlbum.length % this.totalRecordsPerPage === 0) {
            this.setState({
                lastPageIndex: evenArrayLength
            })
        } else {
            this.setState({
                lastPageIndex: oddArrayLength
            })
        }
    }

    //handles go to previous page click
    handlePrevious(e) {
        var currentPage = this.state.currentPageIndex - 1;
        this.handlePagination(currentPage);
    }

    //handles go to next page click
    handleNext(e) {
        var currentPage = this.state.currentPageIndex + 1;
        this.handlePagination(currentPage);
    }

    //handles go to first page click
    handleGoToFirstPage() {
        var currentPage = 0;
        this.handlePagination(currentPage);
    }

    //handles go to last page click
    handleGoToLastPage() {
        this.handlePagination(this.state.lastPageIndex);
    }

    //handles pagination taking current page on which user is on as a parameter
    handlePagination(currentPage) {
        var startIndex = currentPage * this.totalRecordsPerPage;
        var endIndex = startIndex + this.totalRecordsPerPage;
        this.setState({
            currentPageIndex: currentPage
        }, () => {
            this.setState({
                artistAlbum: this.state.originalArtistAlbum.slice(startIndex, endIndex)
            });
        });
    }

    render() {
        return (
            <div className='outerDiv'>

                <div className='searchDiv'>
                    <a href="/">Back to search</a>
                </div>

                <div className='outer clearfix'>
                    <div className="imgDiv">
                        <a><img alt="artistImage" style={{ width: '100%', height: 'auto' }} src={this.state.artistDetail.strArtistThumb ? this.state.artistDetail.strArtistThumb : "https://vignette.wikia.nocookie.net/community-sitcom/images/b/bd/Photo-Unavailable.jpg/revision/latest?cb=20130604203019"} /></a>
                    </div>
                    <div className="content">
                        <h2>{this.state.artistDetail.strArtist}</h2>
                        <p>{this.state.artistDetail.intMembers}</p>
                    </div>
                </div>

                {this.state.noAlbumsFound &&
                    <div>
                        <h2>No Albums from this Artist till now</h2>
                    </div>
                }

                <div>
                    {this.state.artistAlbum.map((item, index) => (
                        <div className='outer clearfix' key={index}>
                            <div className='imgDiv'>
                                <a><img alt="albumImage" style={{ width: '100%', height: 'auto' }} src={item.strAlbumThumb ? item.strAlbumThumb : "https://vignette.wikia.nocookie.net/community-sitcom/images/b/bd/Photo-Unavailable.jpg/revision/latest?cb=20130604203019"} /></a>
                            </div>
                            <div className='content'>
                                <p>{item.strAlbum}</p>
                                <a onClick={(e) => this.fetchAlbumTracks(e, item)}>View Details</a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="buttonGroup">
                    <button disabled={this.state.currentPageIndex === 0} onClick={(e) => this.handleGoToFirstPage(e)}>&#60;&#60;</button>
                    <button disabled={this.state.currentPageIndex === 0} onClick={(e) => this.handlePrevious(e)}>&#60;</button>
                    <button disabled={this.state.currentPageIndex === this.state.lastPageIndex} onClick={(e) => this.handleNext(e)}>&#62;</button>
                    <button disabled={this.state.currentPageIndex === this.state.lastPageIndex} onClick={(e) => this.handleGoToLastPage(e)}>&#62;&#62;</button>
                </div>

                <Modal show={this.state.showModal} onHide={this.closeModel.bind(this)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Track Listing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="clearfix">
                            <h3 className='left'>{this.state.album}</h3>
                            <h3 className='right'>Released: {this.state.releasedDate}</h3>
                        </div>
                        <div className='listArtist'>
                            {this.state.trackList.map((item, index) => (
                                <div className='modalOuter clearfix' key={index}>
                                    <div className='modalTrack'>
                                        <h4>{item.strTrack}</h4>
                                    </div>
                                    <div className='modalDuration'>
                                        <p>min seconds: {item.intDuration / 1000}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}

export default ArtistDetails;