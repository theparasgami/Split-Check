import React, { useState, useEffect } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { LottieAnimation2 } from "../../Constants/Lotties/lottie"
import "./popups.scss";

const PopupStats = (props) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="popup-box popupStats">
            <div className="box">
                {loading ? <LottieAnimation2 /> : <>
                    <CancelIcon className="close-icon"
                        onClick={props.cross}
                    />
                    <div className="head">
                        Stats
                    </div>
                    {(<>
                        <div className="statsHead">Total Group Spendings</div>
                        <div className="gamount"> ₹ {props.totalGroupExpense.toFixed(2)}</div>
                        <div className="statsHead">Total Your Spendings</div>
                        <div className="gamount"> ₹ {props.details.TotalAllTimeExpense.toFixed(2)}</div>
                        <div className="statsHead">Total You Paid</div>
                        <div className="gamount"> ₹ {props.details.TotalYouPaid.toFixed(2)}</div>
                    </>)}

                </>}
            </div>
        </div>
    )


}

export default PopupStats;