import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './InteractiveBlock.css'; // We will create this

const InteractiveBlock = ({ title, description, path, color }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="interactive-block"
            style={{ '--block-color': color }}
            whileHover={{ y: -10 }}
            onClick={() => navigate(path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="block-content">
                <h2>{title}</h2>
                <div className="block-details">
                    <p>{description}</p>
                    <span className="explore-text">Explore &rarr;</span>
                </div>
            </div>
        </motion.div>
    );
};

InteractiveBlock.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    color: PropTypes.string
};

export default InteractiveBlock;
