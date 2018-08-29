import { Button, Modal } from "react-bootstrap";
import React, { Component } from "react";
import ipfs from "../../../ipfs";

class ImageModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      imageBytes: "",
      imageName: "",
      imageType: ""
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow = async (_ipfsHash, _imageName, _imageType) => {
    const ipfsPath = `/ipfs/${_ipfsHash}`;
    await ipfs.files.cat(ipfsPath, (err, file) => {
      if (err) {
        throw err;
      }

      const _imageBytes = file.toString("base64");
      console.log(_imageBytes);

      this.setState({ imageBytes: _imageBytes });
      this.setState({ imageName: _imageName });
      this.setState({ _imageType: _imageType });
      this.setState({ show: true });
    });
  };

  render() {
    const imgStyle = {
      maxWidth: "570px",
      margin: "auto"
    };

    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.state.imageName}</h4>
            <img
              style={imgStyle}
              src={`data:${this.state.imageType};base64,${
                this.state.imageBytes
              }`}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ImageModal;
