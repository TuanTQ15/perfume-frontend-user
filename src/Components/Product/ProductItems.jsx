import React from 'react'
import { connect } from 'react-redux'
import { actAddToCart } from '../../actions/cart'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link, useHistory } from 'react-router-dom'
import NumberFormat from 'react-number-format'



function ProductItems({ item, onAddToCart, grid }) {
    let history = useHistory();
    const MySwal = withReactContent(Swal)
    function handleAddToCart(item) {
        var user = localStorage.getItem('user')
        if (user != null) {
            if (item.quantityInStock <= 0) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Sản phẩm đã hết hàng không thể thêm vào giỏ hàng"
                })
            }
            else {
                onAddToCart(item, 1)
                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm sản phẩm vào giỏ hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } else {
            history.push('/signin')
        }
    }
    // console.log(item)
    return (
        <div className={`col-md-${grid}`} >
            <figure className="card card-product">
                <Link className="img-wrap" to={`/lineproduct/${item.productId}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={item.image} alt="" />
                </Link>
                <Link className="info-wrap" to={`/lineproduct/${item.productId}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <h4 className="title">{item.productName}</h4>
                    <p className="desc">Xuất xứ: {item.origin}</p>
                    <div className="rating-wrap">
                        <ul className="rating-stars">
                            <li>Giới tính: </li>
                        </ul>
                        <div className="label-rating">&nbsp;{item.sex === 1 ? 'Nam' : (item.sex === 2 ? "Nữ" : 'Unisex')}</div>
                        {/* <div className="label-rating">154 orders </div> */}
                    </div>
                </Link>
                <div className="bottom-wrap">
                    <button className="btn btn-sm btn-primary float-right" disabled={item.quantityInStock <= 0 ? true : false}
                        onClick={() => { handleAddToCart(item) }}>
                        {item.quantityInStock <= 0 ? "Out of stock" : "Add To Cart"}
                    </button>
                    <div className="price-wrap h6" style={{ textDecoration: 'none' }}>
                        {/* <span className="price-new">{item.detailPromotion !== null ? item.price * (100 - item.detailPromotion.percenDiscount) / 100 : item.price}đ</span> */}
                        <NumberFormat displayType="text" thousandSeparator={true} value={item.detailPromotion !== null ? item.price * (100 - item.detailPromotion.percentDiscount) / 100 : item.price} suffix={"đ"} />
                        &nbsp;&nbsp;
                        {/* <del className="price-old">{item.detailPromotion !== null ? item.price : ""}</del> */}
                        <del className="price-old"><NumberFormat displayType="text" thousandSeparator={true} value={item.detailPromotion !== null ? item.price : ""} suffix={"đ"} /></del>
                    </div>
                </div>
            </figure>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddToCart: (product, quantity) => {
            dispatch(actAddToCart(product, quantity))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItems)

