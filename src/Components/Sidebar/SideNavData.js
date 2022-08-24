import React from 'react'
import { faLaptop, faMobile, faDesktop, faComputer,faHeadset,faDatabase,faTableList,faChevronDown,faChevronUp, faTablet } from "@fortawesome/free-solid-svg-icons";
// import { faTablet } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideNavData = [
    {
        title: "Laptops",
        path: "/laptops",
        icon: <FontAwesomeIcon icon={faLaptop} />
    },
    {
        title: "Mobiles",
        path: "/mobiles",
        icon: <FontAwesomeIcon icon={faMobile} />
    },
    {
        title: "Tabs",
        path: "/tabs",
        icon: <FontAwesomeIcon icon={faTablet} />
    },
    {
        title: "LEDs",
        path: "/leds",
        icon: <FontAwesomeIcon icon={faDesktop} />
    },
    {
        title: "Desktop Computers",
        path: "/desktop-computers",
        icon: <FontAwesomeIcon icon={faComputer} />
    },
    {
        title: "Accessories",
        path: "/accessories",
        icon: <FontAwesomeIcon icon={faHeadset} />
    },
    {
        title: "Data",
        path: "/data/accessory-type",
        icon: <FontAwesomeIcon icon={faDatabase} />,
        iconClose: <FontAwesomeIcon icon={faChevronDown} />,
        iconOpen: <FontAwesomeIcon icon={faChevronUp} />,
        subNav: [
            {
                title: "Accessory Type",
                path: "/data/accessory-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            },
            {
                title: "Brand",
                path: "/data/brand",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            // ,{
            //     title: "Categories",
            //     path: "/data/categories",
            //     icon: <FontAwesomeIcon icon={faTableList} />
            // }
            ,{
                title: "Color",
                path: "/data/color",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Condition",
                path: "/data/condition",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Desktop Type",
                path: "/data/desktop-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Generation",
                path: "/data/generation",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Graphic Card Specs",
                path: "/data/graphic-card-specs",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Graphic Card Type",
                path: "/data/graphic-card-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Laptop Type",
                path: "/data/laptop-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Screen Size",
                path: "/data/screen-size",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Ports",
                path: "/data/ports",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Processor",
                path: "/data/processor",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "RAM",
                path: "/data/ram",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "RAM Type",
                path: "/data/ram-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Refresh Rate",
                path: "/data/refresh-rate",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Resolution",
                path: "/data/resolution",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Screen Type",
                path: "/data/screen-type",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Speaker",
                path: "/data/speaker",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Storage",
                path: "/data/storage",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
            ,{
                title: "Webcam",
                path: "/data/webcam",
                icon: <FontAwesomeIcon icon={faTableList} />
            }
        ]
    }
]
 
export default SideNavData;