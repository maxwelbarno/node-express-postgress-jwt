import {Router} from 'express'
import register from '../controllers/users'

const route=Router()

route.post('/auth/register', register)

export default route