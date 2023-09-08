import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { UserRouter } from './router/user.router'
import { ConfigServer } from './config/config'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

class ServerBootstrap extends ConfigServer{
  public app: express.Application = express()
  private port: number = this.getNumberEnv('PORT')

  constructor() {
    super()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.dbConnect()

    this.app.use(morgan('dev'))
    this.app.use(cors())
    this.app.use('/api', this.routers())

    this.listen()
  }

  routers() : Array<express.Router> {
    return [new UserRouter().router]
  }

  async dbConnect() : Promise<DataSource> {
    return await new DataSource({
      type: "mysql",
      host: this.getEnvironment('DB_HOST'),
      port: Number(this.getEnvironment("DB_PORT")),
      username: this.getEnvironment('DB_USER'),
      password: this.getEnvironment("DB_PASSWORD"),
      database: this.getEnvironment('DB_DATABASE'),
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: true,
      logging: false,
      namingStrategy: new SnakeNamingStrategy()
    }).initialize()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running in port ${this.port}`)
    })
  }
}

new ServerBootstrap()