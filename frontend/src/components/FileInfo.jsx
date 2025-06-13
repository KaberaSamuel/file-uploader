import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { dividerClasses } from "@mui/material";


function FileInfo({activeFile, setActiveFile}) {

    return (
        <AnimatePresence>
            {activeFile && 
            <div 
                className="file-info-backdrop"
                onClick={() => setActiveFile(null)}
            >
                <motion.div 
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                type: "spring",
                duration: 0.5
                }}
                className="file-info" 
                onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <div className="header">
                        <p>File Information</p>
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={() => {setActiveFile(null)}} />
                    </div>

                    <div className="middle">
                        <p><span>Name: </span> {activeFile.name}</p>
                        <p><span>Type: </span> {activeFile.type}</p>
                        <p><span>Size: </span> {activeFile.convertedSize}</p>
                        <p><span>Created: </span> {activeFile.created_at}</p>
                    </div>

                    <div className="buttons">
                        <button onClick={() => {setActiveFile(null)}}>Close</button>
                        <button>Share</button>
                        <button>Delete</button>
                        <button>Download</button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    )
}

export default FileInfo