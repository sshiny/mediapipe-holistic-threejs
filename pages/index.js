import React, { useEffect, useRef } from "react";
import { Button, Row, Col, Spin, Tabs } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import styles from '../styles/index.module.css'
import { init, animate, updateAvatar, updateWorld } from "../src/scene";
import { PoseDetector } from "../src/mediapipe";

const { TabPane } = Tabs;
const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

export default function Avatar() {
    const preload = useRef();
    const canvas = useRef();
    const videoInput = useRef();

    useEffect(() => {
        let currUser = null;

        init(canvas.current, currUser);
        animate();

        const [detector, camera] = PoseDetector(
            preload.current,
            videoInput.current
        );

        camera.start();

        return function cleanup() {
            detector.close();
            camera.stop();
        };
    });

    return (
        <div id="holistic">
            <Row>
                <Col span={24}>
                    <div ref={canvas}></div>
                    {/* <video hidden ref={videoInput} width="1080px" height="1920px"></video> */}
                    <video style={{
                            display: "block!important",
                            zIndex: 9999999,
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "200px",
                            height: "300px",
                            transform: "rotateY(180deg)"
                    }} ref={videoInput} width="200px" height="300px"></video>
                </Col>
            </Row>

            <h1 ref={preload}><span className={styles.loadingtext}> Loading <Spin indicator={antIcon}/></span></h1>
        </div>
    );
}
