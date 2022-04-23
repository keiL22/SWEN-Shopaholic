const requireAuth = (req, res, next) => {
    const userSession = req.session.user

    if(userSession){

    }
    else {
        res.redirect('/login')
    }
}