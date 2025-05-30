/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 5.28.0
 * source: Squash.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from './Commit'
import * as pb_1 from 'google-protobuf'
export class SquashLock extends pb_1.Message {
  #one_of_decls: number[][] = []
  constructor(
    data?:
      | any[]
      | {
          lockId?: string
          lockExpiration?: number
          commitId?: string
          commit?: dependency_1.Commit
        },
  ) {
    super()
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls)
    if (!Array.isArray(data) && typeof data == 'object') {
      if ('lockId' in data && data.lockId != undefined) {
        this.lockId = data.lockId
      }
      if ('lockExpiration' in data && data.lockExpiration != undefined) {
        this.lockExpiration = data.lockExpiration
      }
      if ('commitId' in data && data.commitId != undefined) {
        this.commitId = data.commitId
      }
      if ('commit' in data && data.commit != undefined) {
        this.commit = data.commit
      }
    }
  }
  get lockId() {
    return pb_1.Message.getFieldWithDefault(this, 1, '') as string
  }
  set lockId(value: string) {
    pb_1.Message.setField(this, 1, value)
  }
  get lockExpiration() {
    return pb_1.Message.getFieldWithDefault(this, 2, 0) as number
  }
  set lockExpiration(value: number) {
    pb_1.Message.setField(this, 2, value)
  }
  get commitId() {
    return pb_1.Message.getFieldWithDefault(this, 3, '') as string
  }
  set commitId(value: string) {
    pb_1.Message.setField(this, 3, value)
  }
  get commit() {
    return pb_1.Message.getWrapperField(this, dependency_1.Commit, 4) as dependency_1.Commit
  }
  set commit(value: dependency_1.Commit) {
    pb_1.Message.setWrapperField(this, 4, value)
  }
  get has_commit() {
    return pb_1.Message.getField(this, 4) != null
  }
  static fromObject(data: {
    lockId?: string
    lockExpiration?: number
    commitId?: string
    commit?: ReturnType<typeof dependency_1.Commit.prototype.toObject>
  }): SquashLock {
    const message = new SquashLock({})
    if (data.lockId != null) {
      message.lockId = data.lockId
    }
    if (data.lockExpiration != null) {
      message.lockExpiration = data.lockExpiration
    }
    if (data.commitId != null) {
      message.commitId = data.commitId
    }
    if (data.commit != null) {
      message.commit = dependency_1.Commit.fromObject(data.commit)
    }
    return message
  }
  toObject() {
    const data: {
      lockId?: string
      lockExpiration?: number
      commitId?: string
      commit?: ReturnType<typeof dependency_1.Commit.prototype.toObject>
    } = {}
    if (this.lockId != null) {
      data.lockId = this.lockId
    }
    if (this.lockExpiration != null) {
      data.lockExpiration = this.lockExpiration
    }
    if (this.commitId != null) {
      data.commitId = this.commitId
    }
    if (this.commit != null) {
      data.commit = this.commit.toObject()
    }
    return data
  }
  serialize(): Uint8Array
  serialize(w: pb_1.BinaryWriter): void
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter()
    if (this.lockId.length) writer.writeString(1, this.lockId)
    if (this.lockExpiration != 0) writer.writeUint64(2, this.lockExpiration)
    if (this.commitId.length) writer.writeString(3, this.commitId)
    if (this.has_commit) writer.writeMessage(4, this.commit, () => this.commit.serialize(writer))
    if (!w) return writer.getResultBuffer()
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SquashLock {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes),
      message = new SquashLock()
    while (reader.nextField()) {
      if (reader.isEndGroup()) break
      switch (reader.getFieldNumber()) {
        case 1:
          message.lockId = reader.readString()
          break
        case 2:
          message.lockExpiration = reader.readUint64()
          break
        case 3:
          message.commitId = reader.readString()
          break
        case 4:
          reader.readMessage(message.commit, () => (message.commit = dependency_1.Commit.deserialize(reader)))
          break
        default:
          reader.skipField()
      }
    }
    return message
  }
  serializeBinary(): Uint8Array {
    return this.serialize()
  }
  static deserializeBinary(bytes: Uint8Array): SquashLock {
    return SquashLock.deserialize(bytes)
  }
}
export class SquashCommit extends pb_1.Message {
  #one_of_decls: number[][] = []
  constructor(
    data?:
      | any[]
      | {
          lockId?: string
          commitId?: string
          commit?: dependency_1.Commit
        },
  ) {
    super()
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls)
    if (!Array.isArray(data) && typeof data == 'object') {
      if ('lockId' in data && data.lockId != undefined) {
        this.lockId = data.lockId
      }
      if ('commitId' in data && data.commitId != undefined) {
        this.commitId = data.commitId
      }
      if ('commit' in data && data.commit != undefined) {
        this.commit = data.commit
      }
    }
  }
  get lockId() {
    return pb_1.Message.getFieldWithDefault(this, 1, '') as string
  }
  set lockId(value: string) {
    pb_1.Message.setField(this, 1, value)
  }
  get commitId() {
    return pb_1.Message.getFieldWithDefault(this, 2, '') as string
  }
  set commitId(value: string) {
    pb_1.Message.setField(this, 2, value)
  }
  get commit() {
    return pb_1.Message.getWrapperField(this, dependency_1.Commit, 3) as dependency_1.Commit
  }
  set commit(value: dependency_1.Commit) {
    pb_1.Message.setWrapperField(this, 3, value)
  }
  get has_commit() {
    return pb_1.Message.getField(this, 3) != null
  }
  static fromObject(data: {
    lockId?: string
    commitId?: string
    commit?: ReturnType<typeof dependency_1.Commit.prototype.toObject>
  }): SquashCommit {
    const message = new SquashCommit({})
    if (data.lockId != null) {
      message.lockId = data.lockId
    }
    if (data.commitId != null) {
      message.commitId = data.commitId
    }
    if (data.commit != null) {
      message.commit = dependency_1.Commit.fromObject(data.commit)
    }
    return message
  }
  toObject() {
    const data: {
      lockId?: string
      commitId?: string
      commit?: ReturnType<typeof dependency_1.Commit.prototype.toObject>
    } = {}
    if (this.lockId != null) {
      data.lockId = this.lockId
    }
    if (this.commitId != null) {
      data.commitId = this.commitId
    }
    if (this.commit != null) {
      data.commit = this.commit.toObject()
    }
    return data
  }
  serialize(): Uint8Array
  serialize(w: pb_1.BinaryWriter): void
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter()
    if (this.lockId.length) writer.writeString(1, this.lockId)
    if (this.commitId.length) writer.writeString(2, this.commitId)
    if (this.has_commit) writer.writeMessage(3, this.commit, () => this.commit.serialize(writer))
    if (!w) return writer.getResultBuffer()
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SquashCommit {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes),
      message = new SquashCommit()
    while (reader.nextField()) {
      if (reader.isEndGroup()) break
      switch (reader.getFieldNumber()) {
        case 1:
          message.lockId = reader.readString()
          break
        case 2:
          message.commitId = reader.readString()
          break
        case 3:
          reader.readMessage(message.commit, () => (message.commit = dependency_1.Commit.deserialize(reader)))
          break
        default:
          reader.skipField()
      }
    }
    return message
  }
  serializeBinary(): Uint8Array {
    return this.serialize()
  }
  static deserializeBinary(bytes: Uint8Array): SquashCommit {
    return SquashCommit.deserialize(bytes)
  }
}
