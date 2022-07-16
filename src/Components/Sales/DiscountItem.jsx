import React from 'react'
import NumberFormat from 'react-number-format'
import { Link } from 'react-router-dom'

function DiscountItem({ item }) {
    return (
        <Link to={`/lineproduct/${item.productId}`} style={{ textDecoration: 'none' }}>
            <div className="card mt-2 mb-2">
                <figure className="itemside">
                    
                    <div className="aside">
                    <small className="bg-danger" style={{ color: 'white', fontSize: 14  ,position: "static"}}>{item.detailPromotion.percentDiscount}% </small>
                        <div className="img-wrap img-sm border-right"><img src={item.image} alt="" /></div>
                    </div>
                    <figcaption className="p-3">
                    
                        <h6 className="title">{item.productName}</h6>
                        
                        <div className="price-wrap">
                            
                            <span className="price-new b">
                                <NumberFormat thousandSeparator={true} displayType={'text'} suffix={'đ'}
                                    value={item.price * (100 - item.detailPromotion.percentDiscount) / 100} />
                            </span>&nbsp;&nbsp;
                            <del className="price-old text-muted">
                                <NumberFormat thousandSeparator={true} displayType={'text'} suffix={'đ'}
                                    value={item.price} />
                            </del>
                           
                        </div>
                        
                        {/* <!-- price-wrap.// --> */}
                    </figcaption>
                </figure>
            </div>
        </Link>
    )
}

export default DiscountItem
