let db = require('quick.db')
module.exports = async (client) => {
const User = require('./schema/profile-schema')

let cash = db.all().filter(data => data.ID.startsWith(`cash_`))
let gold = db.all().filter(data => data.ID.startsWith(`goldbal_`))
let bank = db.all().filter(data => data.ID.startsWith(`bank_`))
let banklimit = db.all().filter(data => data.ID.startsWith(`banklimit_`))

let rp = db.all().filter(data => data.ID.startsWith(`rp_`))
let wheelspins = db.all().filter(data => data.ID.startsWith(`wheelspins_`))
let swheelspins = db.all().filter(data => data.ID.startsWith(`swheelspins_`))
let prestige = db.all().filter(data => data.ID.startsWith(`prestige_`))
let patreon1 = db.all().filter(data => data.ID.startsWith(`patreon_tier_1_`))
let patreon2 = db.all().filter(data => data.ID.startsWith(`patreon_tier_2_`))
let patreon3 = db.all().filter(data => data.ID.startsWith(`patreon_tier_3_`))
let patreon4 = db.all().filter(data => data.ID.startsWith(`patreon_tier_4_`))
let garagelimit = db.all().filter(data => data.ID.startsWith(`garagelimit_`))


for (b in cash) {
let user = cash[b]

let id = user.ID.split("_")[1]
let cash2 = user.data
let userdata =  await User.findOne({id: id}) || new User({id: id})

console.log(id)

await User.findOneAndUpdate({
    id: id
}, {
    $set: {
      cash: cash2
    }
})
userdata.save()
}

for (b in gold) {
    let user = gold[b]
    
    let id = user.ID.split("_")[1]
    let cash2 = user.data
    let userdata =  await User.findOne({id: id}) || new User({id: id})
    
    console.log(id)
    
    await User.findOneAndUpdate({
        id: id
    }, {
        $set: {
            gold: cash2
        }
    })
    userdata.save()
    }
    for (b in bank) {
        let user = bank[b]
        
        let id = user.ID.split("_")[1]
        let cash2 = user.data
        let userdata =  await User.findOne({id: id}) || new User({id: id})
        
        console.log(id)
        
        await User.findOneAndUpdate({
            id: id
        }, {
            $set: {
                bank: cash2
            }
        })
        userdata.save()
        }
        for (b in rp) {
            let user = rp[b]
            
            let id = user.ID.split("_")[1]
            let cash2 = user.data
            let userdata =  await User.findOne({id: id}) || new User({id: id})
            
            console.log(id)
            
            await User.findOneAndUpdate({
                id: id
            }, {
                $set: {
                    rp: cash2
                }
            })
            userdata.save()
            }
            for (b in wheelspins) {
                let user = wheelspins[b]
                
                let id = user.ID.split("_")[1]
                let cash2 = user.data
                let userdata =  await User.findOne({id: id}) || new User({id: id})
                
                console.log(id)
                
                await User.findOneAndUpdate({
                    id: id
                }, {
                    $set: {
                        wheelspins: cash2
                    }
                })
                userdata.save()
                }
                for (b in swheelspins) {
                    let user = swheelspins[b]
                    
                    let id = user.ID.split("_")[1]
                    let cash2 = user.data
                    let userdata =  await User.findOne({id: id}) || new User({id: id})
                    
                    console.log(id)
                    
                    await User.findOneAndUpdate({
                        id: id
                    }, {
                        $set: {
                            swheelspins: cash2
                        }
                    })
                    userdata.save()
                    }
                    for (b in prestige) {
                        let user = prestige[b]
                        
                        let id = user.ID.split("_")[1]
                        let cash2 = user.data
                        let userdata =  await User.findOne({id: id}) || new User({id: id})
                        
                        console.log(id)
                        
                        await User.findOneAndUpdate({
                            id: id
                        }, {
                            $set: {
                                prestige: cash2
                            }
                        })
                        userdata.save()
                        }

                    for (b in patreon1) {
                    let user = patreon1[b]
                    let patronobj = {
                        tier: 1,
                        timeout: 30000
                    }
                    let id = user.ID.split("_")[1]
                    let cash2 = user.data
                    let userdata =  await User.findOne({id: id}) || new User({id: id})
                    
                    console.log(id)
                    
                    await User.findOneAndUpdate({
                        id: id
                    }, {
                        $set: {
                            patron: patronobj
                        }
                    })
                    userdata.save()
                    }
                    for (b in patreon2) {
                        let user = patreon2[b]
                        let patronobj = {
                            tier: 2,
                            timeout: 15000
                        }
                        let id = user.ID.split("_")[1]
                        let cash2 = user.data
                        let userdata =  await User.findOne({id: id}) || new User({id: id})
                        
                        console.log(id)
                        
                        await User.findOneAndUpdate({
                            id: id
                        }, {
                            $set: {
                                patron: patronobj
                            }
                        })
                        userdata.save()
                        }
                        for (b in patreon3) {
                            let user = patreon3[b]
                            let patronobj = {
                                tier: 3,
                                timeout: 5000
                            }
                            let id = user.ID.split("_")[1]
                            let cash2 = user.data
                            let userdata =  await User.findOne({id: id}) || new User({id: id})
                            
                            console.log(id)
                            
                            await User.findOneAndUpdate({
                                id: id
                            }, {
                                $set: {
                                    patron: patronobj
                                }
                            })
                            userdata.save()
                            }
                            for (b in patreon4) {
                                let user = patreon4[b]
                                let patronobj = {
                                    tier: 4,
                                    timeout: 5000
                                }
                                let id = user.ID.split("_")[1]
                                let cash2 = user.data
                                let userdata =  await User.findOne({id: id}) || new User({id: id})
                                
                                console.log(id)
                                
                                await User.findOneAndUpdate({
                                    id: id
                                }, {
                                    $set: {
                                        patron: patronobj
                                    }
                                })
                                userdata.save()
                                }
                                for (b in garagelimit) {
                                    let user = garagelimit[b]
                           
                                    let id = user.ID.split("_")[1]
                                    let cash2 = user.data
                                    let userdata =  await User.findOne({id: id}) || new User({id: id})
                                    
                                    console.log(id)
                                    
                                    await User.findOneAndUpdate({
                                        id: id
                                    }, {
                                        $set: {
                                            garageLimit: cash2
                                        }
                                    })
                                    userdata.save()
                                    }
                                    for (b in banklimit) {
                                        let user = banklimit[b]
                               
                                        let id = user.ID.split("_")[1]
                                        let cash2 = user.data
                                        let userdata =  await User.findOne({id: id}) || new User({id: id})
                                        
                                        console.log(id)
                                        
                                        await User.findOneAndUpdate({
                                            id: id
                                        }, {
                                            $set: {
                                                banklimit: cash2
                                            }
                                        })
                                        userdata.save()
                                        }

                  

console.log(cash)



}